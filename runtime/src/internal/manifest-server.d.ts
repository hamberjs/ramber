import { Preload } from '@ramber/common';
import { RamberRequest, RamberResponse } from '@ramber/server';

export const src_dir: string;
export const build_dir: string;
export const dev: boolean;
export const manifest: Manifest;

export type { RamberRequest, RamberResponse };

export interface SSRComponentModule {
	default: SSRComponent;
	preload?: Preload;
}

export interface SSRComponent {
	render(props: unknown): {
		html: string
		head: string
		css: { code: string, map: unknown };
	}
}

export interface Manifest {
	server_routes: ServerRoute[];
	ignore: RegExp[];
	root_comp: SSRComponentModule
	error: SSRComponent
	pages: ManifestPage[]
}

export interface ManifestPage {
	pattern: RegExp | null;
	parts: ManifestPagePart[];
}

export interface ManifestPagePart {
	name: string | null;
	file?: string;
	component: SSRComponentModule;
	params?: (match: RegExpMatchArray | null) => Record<string, string>;
}

export type Handler = (req: RamberRequest, res: RamberResponse, next: () => void) => void;

export interface ServerRoute {
	pattern: RegExp;
	handlers: Record<string, Handler>;
	params: (match: RegExpMatchArray) => Record<string, string>;
}
