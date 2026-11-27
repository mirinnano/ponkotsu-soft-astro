/* tslint:disable */
/* eslint-disable */

/**
 * Read-only integrity-checked Web pak. Logical paths are resolved inside
 * Rust so the PWA never needs to know hashed archive entry names.
 */
export class WebPak {
    free(): void;
    [Symbol.dispose](): void;
    content_root_blake3(): string;
    game_id(): string;
    constructor(bytes: Uint8Array);
    /**
     * Opens a signed/protected pack with keys delivered by the Web
     * bootstrap. Keys are short-lived runtime inputs; they are never
     * stored in the Core VM or in the package manifest.
     */
    static new_with_keys(bytes: Uint8Array, verification_key_id: string, verification_key_hex: string, encryption_key_id: string, encryption_key_hex: string): WebPak;
    read(logical_path: string): Uint8Array;
}

export class WebRuntime {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Hands over one fetched `.ariaplugin`; see `install_plugins`.
     */
    add_plugin_candidate(source: string, bytes: Uint8Array): void;
    /**
     * Verifies and installs the candidates against the bundle's
     * `plugins` table (its JSON) and returns a JSON report.
     */
    install_plugins(plugins_json: string): string;
    install_system_data_json(system_json: string): void;
    constructor(ariac: Uint8Array, logical_width: number, logical_height: number);
    /**
     * The `ui.js` bytes an installed plugin ships, or an empty array.
     */
    plugin_ui_module(plugin_id: string): Uint8Array;
    restore_envelope_json(envelope_json: string): void;
    restore_json(snapshot_json: string): void;
    save_envelope_json(timestamp_unix_ms: bigint): string;
    snapshot_json(): string;
    step(input_json: string): string;
    system_data_json(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_webpak_free: (a: number, b: number) => void;
    readonly webpak_new: (a: number, b: number, c: number) => void;
    readonly webpak_new_with_keys: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
    readonly webpak_read: (a: number, b: number, c: number, d: number) => void;
    readonly webpak_game_id: (a: number, b: number) => void;
    readonly webpak_content_root_blake3: (a: number, b: number) => void;
    readonly __wbg_webruntime_free: (a: number, b: number) => void;
    readonly webruntime_new: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly webruntime_add_plugin_candidate: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly webruntime_install_plugins: (a: number, b: number, c: number, d: number) => void;
    readonly webruntime_plugin_ui_module: (a: number, b: number, c: number, d: number) => void;
    readonly webruntime_step: (a: number, b: number, c: number, d: number) => void;
    readonly webruntime_snapshot_json: (a: number, b: number) => void;
    readonly webruntime_restore_json: (a: number, b: number, c: number, d: number) => void;
    readonly webruntime_system_data_json: (a: number, b: number) => void;
    readonly webruntime_install_system_data_json: (a: number, b: number, c: number, d: number) => void;
    readonly webruntime_save_envelope_json: (a: number, b: number, c: bigint) => void;
    readonly webruntime_restore_envelope_json: (a: number, b: number, c: number, d: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export2: (a: number, b: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
