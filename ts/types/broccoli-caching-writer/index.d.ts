declare module 'broccoli-caching-writer' {
  import Plugin from 'broccoli-plugin';

  export default class BroccoliCachingWriter extends Plugin {
    _cachingWriterPersistentOutput: boolean;
    _lastKeys: any;
    _shouldBeIgnoredCache: any;
    _resetStats: () => void;
    _cacheInclude?: string[];
    _cacheExclude?: string[];
    _inputFiles?: any;
    _stats: {
      inputPaths: string[];
      stats: number;
      files: number;
    }
    get debug(): any;

    getCallbackObject: () => {
      build: () => void;
    }
    _conditionalBuild: () => void;
    shouldBeIgnored:() => boolean;
    listFiles: () => string[];
    listEntries: () => string[];
  }
}