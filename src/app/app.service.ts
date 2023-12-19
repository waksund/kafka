import {Injectable} from "@nestjs/common";

@Injectable()
export class AppService{
    handleExampleEvent(message: string): Promise<void>{
        console.log(message);
        return Promise.resolve();
    }
}