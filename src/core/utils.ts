import { ApiBody } from '@nestjs/swagger';

export interface StringMap<T> {
  [x: string]: T;
}
export interface IResponse{
  success: boolean;
  message: string;
  errorMessage: string;
  data: any[];
  error: any;
}

export class ResponseSuccess implements IResponse {
  constructor(infoMessage: string, data?: any) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
}

export function getPassedMinutes(date: Date): number {
  if (!date) {
    return null;
  }
  const now = new Date().getTime();
  const before = date.getTime();
  return Math.abs((now - before) / 60000);
}

export function objectToFlattenMongoNotation(ob: {}): {} {
  const toReturn = {};

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
      const flatObject = objectToFlattenMongoNotation(ob[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

export function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data))
    return data;
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultholder = {};
  for (const p in data) {
    let cur = resultholder,
      prop = "",
      m;
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultholder[""];
}

export function flatten(o, map={}, prefix=''){ // map is a plain object
  if (Array.isArray(o)) {
    for (let k=0;k<o.length;k++){
      if (typeof o[k]=='object'&&o[k]) flatten(o[k], map, prefix+'['+k+']');
      else map[prefix+'['+k+']'] = o[k];
    }
    return map;
  }
  for (const k in o){
    if (typeof o[k]=='object'&&o[k]) flatten(o[k], map, (prefix?prefix+'.':'')+k);
    else map[(prefix?prefix+'.':'')+k] = o[k];
  }
  return map;
}

export const ApiFile = (fileName = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};


export function mapLanguageObjectToProps(langKey, obj) {
  if (obj.i18n && obj.i18n[langKey]) {
    obj = JSON.parse(JSON.stringify(obj));
    const i18nObj = flatten(obj.i18n[langKey]);
    delete obj.i18n;
    const entityObj = flatten(obj);
    Object.keys(i18nObj).forEach(key => {
      entityObj[key] = i18nObj[key];
    });
    return unflatten(entityObj);
  }
  if (langKey) {
    obj = JSON.parse(JSON.stringify(obj));
    delete obj.i18n;
    return obj;
  }
  return obj;
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  a = JSON.parse(JSON.stringify(a));
  b = JSON.parse(JSON.stringify(b));
  a.sort();
  b.sort();

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
