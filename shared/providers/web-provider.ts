import { ClarityAbiFunction } from '@stacks/transactions';
import { Transaction } from '../transaction';
import { BaseProvider } from './base-provider';

export class WebProvider implements BaseProvider {


    


    callReadOnly(func: ClarityAbiFunction, args: any[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    callPublic(func: ClarityAbiFunction, args: any[]): Transaction<any, any> {
        throw new Error('Method not implemented.');
    }

}