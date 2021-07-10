export function unchanged(codeBody: string) {
  return codeBody;
}

export interface IMetadata {
  discriminator: 'metadata';
  callerPrivateKey: string;
}

export class Metadata implements IMetadata {
  discriminator: "metadata";
  callerPrivateKey: string;

  public constructor(privateKey: string) {
    this.callerPrivateKey = privateKey;
    this.discriminator = 'metadata'
  }
}

export const NO_METADATA: IMetadata = new Metadata('');

export function instanceOfMetadata(object: any): object is IMetadata {
  return object != null && object.discriminator === 'metadata';
}

export interface IFunctionParameteers {
  args: string[];
  metadata: IMetadata;
}