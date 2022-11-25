import { writable } from 'hamber/store';

export const stores = {
	preloading: writable(false),
	page: writable(null)
};

export const CONTEXT_KEY = {};

export const preload = () => ({});