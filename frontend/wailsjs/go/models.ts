export namespace manager {
	
	export class FileInfo {
	    name: string;
	    modTime: string;
	    isDir: boolean;
	    mode: string;
	    width: number;
	    height: number;
	    size: number;
	    filePath: string;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.modTime = source["modTime"];
	        this.isDir = source["isDir"];
	        this.mode = source["mode"];
	        this.width = source["width"];
	        this.height = source["height"];
	        this.size = source["size"];
	        this.filePath = source["filePath"];
	    }
	}
	export class FileResult {
	    fileInfo: FileInfo;
	    base64Encoded: string;
	    status: number;
	    message: string;
	
	    static createFrom(source: any = {}) {
	        return new FileResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fileInfo = this.convertValues(source["fileInfo"], FileInfo);
	        this.base64Encoded = source["base64Encoded"];
	        this.status = source["status"];
	        this.message = source["message"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PreviewImageHandlerOptions {
	    width: number;
	    height: number;
	    filter: string;
	    blur: number;
	    sharpening: number;
	    gamma: number;
	    contrast: number;
	    brightness: number;
	    saturation: number;
	
	    static createFrom(source: any = {}) {
	        return new PreviewImageHandlerOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.width = source["width"];
	        this.height = source["height"];
	        this.filter = source["filter"];
	        this.blur = source["blur"];
	        this.sharpening = source["sharpening"];
	        this.gamma = source["gamma"];
	        this.contrast = source["contrast"];
	        this.brightness = source["brightness"];
	        this.saturation = source["saturation"];
	    }
	}

}

export namespace options {
	
	export class SecondInstanceData {
	    Args: string[];
	    WorkingDirectory: string;
	
	    static createFrom(source: any = {}) {
	        return new SecondInstanceData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Args = source["Args"];
	        this.WorkingDirectory = source["WorkingDirectory"];
	    }
	}

}

