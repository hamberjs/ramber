import * as fs from 'fs';
import * as path from 'path';
import { Page, PageComponent, ServerRoute, ManifestData } from '../interfaces';
import { posixify, reserved_words } from '../utils';

export default function create_manifest_data(cwd: string, extensions = '.hamber .html'): ManifestData {

	const component_extensions = extensions.split(' ');

	// TODO remove in a future version
	if (!fs.existsSync(cwd)) {
		throw new Error('As of Ramber 0.21, the routes/ directory should become src/routes/');
	}

	function find_layout(file_name: string, component_name: string, dir = '') {
		const ext = component_extensions.find((ext) => fs.existsSync(path.join(cwd, dir, `${file_name}${ext}`)));
		const file = posixify(path.join(dir, `${file_name}${ext}`));

		return ext
			? {
				name: component_name,
				file
			}
			: null;
	}

	const components: PageComponent[] = [];
	const pages: Page[] = [];
	const server_routes: ServerRoute[] = [];

	const default_layout: PageComponent = {
		default: true,
		type: 'layout',
		name: '_default_layout',
		file: null
	};

	const default_error: PageComponent = {
		default: true,
		type: 'error',
		name: '_default_error',
		file: null
	};

	function walk(
		dir: string,
		parent_segments: Part[][],
		parent_params: string[],
		stack: Array<{
			component: PageComponent;
			params: string[];
		}>
	) {
		const items = fs.readdirSync(dir)
			.map(basename => {
				const resolved = path.join(dir, basename);
				const file = path.relative(cwd, resolved);
				const is_dir = fs.statSync(resolved).isDirectory();

				const file_ext = path.extname(basename);

				if (basename[0] === '_') return null;
				if (basename[0] === '.' && basename !== '.well-known') return null;
				if (!is_dir && !/^\.[a-z]+$/i.test(file_ext)) return null; // filter out tmp files etc

				const component_extension = component_extensions.find((ext) => basename.endsWith(ext));
				const ext = component_extension || file_ext;
				const is_page = component_extension != null;
				const segment = is_dir ? basename : basename.slice(0, -ext.length);


				if (/\]\[/.test(segment)) {
					throw new Error(`Invalid route ${file} — parameters must be separated`);
				}

				const parts = get_parts(segment);
				const is_index = is_dir ? false : basename.startsWith('index.');
				const route_suffix = basename.slice(basename.indexOf('.'), -ext.length);

				parts.forEach(part => {
					if (part.qualifier && /[()?:]/.test(part.qualifier.slice(1, -1))) {
						throw new Error(`Invalid route ${file} — cannot use (, ), ? or : in route qualifiers`);
					}
				});

				return {
					basename,
					ext,
					parts,
					file: posixify(file),
					is_dir,
					is_index,
					is_page,
					route_suffix
				};
			})
			.filter(Boolean)
			.sort(comparator);

		items.forEach(item => {
			const segments = parent_segments.slice();

			if (item.is_index) {
				if (item.route_suffix) {
					if (segments.length > 0) {
						const last_segment = segments[segments.length - 1].slice();
						const last_part = last_segment[last_segment.length - 1];

						if (last_part.dynamic) {
							last_segment.push({ dynamic: false, content: item.route_suffix });
						} else {
							last_segment[last_segment.length - 1] = {
								dynamic: false,
								content: `${last_part.content}${item.route_suffix}`
							};
						}

						segments[segments.length - 1] = last_segment;
					} else {
						segments.push(item.parts);
					}
				}
			} else {
				segments.push(item.parts);
			}

			const params = parent_params.slice();
			params.push(...item.parts.filter(p => p.dynamic).map(p => p.content));

			if (item.is_dir) {
				const component = find_layout('_layout', `${get_slug(item.file)}__layout`, item.file);

				if (component) components.push(component);

				walk(
					path.join(dir, item.basename),
					segments,
					params,
					component
						? stack.concat({ component, params })
						: stack.concat(null)
				);
			} else if (item.is_page) {
				const component = {
					name: get_slug(item.file),
					file: item.file
				};

				components.push(component);

				const parts = (item.is_index && stack[stack.length - 1] === null)
					? stack.slice(0, -1).concat({ component, params })
					: stack.concat({ component, params });

				pages.push({
					pattern: get_pattern(segments, true),
					parts
				});
			} else {
				server_routes.push({
					name: `route_${get_slug(item.file)}`,
					pattern: get_pattern(segments, !item.route_suffix),
					file: item.file,
					params
				});
			}
		});
	}

	const root = find_layout('_layout', 'main') || default_layout;
	const error = find_layout('_error', 'error') || default_error;

	walk(cwd, [], [], []);

	// check for clashes
	const seen_pages: Map<string, Page> = new Map();
	pages.forEach(page => {
		const pattern = page.pattern.toString();
		if (seen_pages.has(pattern)) {
			const file = page.parts.pop().component.file;
			const other_page = seen_pages.get(pattern);
			const other_file = other_page.parts.pop().component.file;

			throw new Error(`The ${other_file} and ${file} pages clash`);
		}

		seen_pages.set(pattern, page);
	});

	const seen_routes: Map<string, ServerRoute> = new Map();
	server_routes.forEach(route => {
		const pattern = route.pattern.toString();
		if (seen_routes.has(pattern)) {
			const other_route = seen_routes.get(pattern);
			throw new Error(`The ${other_route.file} and ${route.file} routes clash`);
		}

		seen_routes.set(pattern, route);
	});

	return {
		root,
		error,
		components,
		pages,
		server_routes
	};
}

type Part = {
	content: string;
	dynamic: boolean;
	qualifier?: string;
	spread?: boolean;
};

function is_spread(path: string) {
	const spread_pattern = /\[\.{3}/g;
	return spread_pattern.test(path);
}

function comparator(
	a: { basename: string; parts: Part[]; file: string; is_index: boolean; },
	b: { basename: string; parts: Part[]; file: string; is_index: boolean; }
) {
	if (a.is_index !== b.is_index) {
		if (a.is_index) return is_spread(a.file) ? 1 : -1;

		return is_spread(b.file) ? -1 : 1;
	}

	const max = Math.max(a.parts.length, b.parts.length);

	for (let i = 0; i < max; i += 1) {
		const a_sub_part = a.parts[i];
		const b_sub_part = b.parts[i];

		if (!a_sub_part) return 1; // b is more specific, so goes first
		if (!b_sub_part) return -1;

		// if spread && index, order later
		if (a_sub_part.spread && b_sub_part.spread) {
			return a.is_index ? 1 : -1;
		}

		// If one is ...spread order it later
		if (a_sub_part.spread !== b_sub_part.spread) return a_sub_part.spread ? 1 : -1;

		if (a_sub_part.dynamic !== b_sub_part.dynamic) {
			return a_sub_part.dynamic ? 1 : -1;
		}

		if (!a_sub_part.dynamic && a_sub_part.content !== b_sub_part.content) {
			return (
				(b_sub_part.content.length - a_sub_part.content.length) ||
				(a_sub_part.content < b_sub_part.content ? -1 : 1)
			);
		}

		// If both parts dynamic, check for regexp patterns
		if (a_sub_part.dynamic && b_sub_part.dynamic) {
			const regexp_pattern = /\((.*?)\)/;
			const a_match = regexp_pattern.exec(a_sub_part.content);
			const b_match = regexp_pattern.exec(b_sub_part.content);

			if (!a_match && b_match) {
				return 1; // No regexp, so less specific than b
			}
			if (!b_match && a_match) {
				return -1;
			}
			if (a_match && b_match && a_match[1] !== b_match[1]) {
				return b_match[1].length - a_match[1].length;
			}
		}
	}
}

function get_parts(part: string): Part[] {
	return part.split(/\[(.+?\(.+?\)|.+?)\]/)
		.map((str, i) => {
			if (!str) return null;
			const dynamic = i % 2 === 1;

			const [, content, qualifier] = dynamic
				? /([^(]+)(\(.+\))?$/.exec(str)
				: [null, str, null];

			return {
				content,
				dynamic,
				spread: /^\.{3}.+$/.test(content),
				qualifier
			};
		})
		.filter(Boolean);
}

function get_slug(file: string) {
	let name = file
		.replace(/[\\/]index/, '')
		.replace(/[/\\]/g, '_')
		.replace(/\.\w+$/, '')
		.replace(/\[([^(]+)(?:\([^(]+\))?\]/, '$$$1')
		.replace(/[^a-zA-Z0-9_$]/g, c => {
			return c === '.' ? '_' : `$${c.charCodeAt(0)}`;
		});

	if (reserved_words.has(name)) name += '_';
	return name;
}

function get_pattern(segments: Part[][], add_trailing_slash: boolean) {
	const path = segments.map(segment => {
		return segment.map(part => {
			return part.dynamic
				? part.qualifier || (part.spread ? '(.+)' : '([^/]+?)')
				: encodeURI(part.content.normalize())
					.replace(/\?/g, '%3F')
					.replace(/#/g, '%23')
					.replace(/%5B/g, '[')
					.replace(/%5D/g, ']')
					.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}).join('');
	}).join('\\/');

	const trailing = add_trailing_slash && segments.length ? '\\/?$' : '$';

	return new RegExp(`^\\/${path}${trailing}`);
}
