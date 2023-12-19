import {Controller} from "@nestjs/common";
import {EventPattern, Payload, Transport} from "@nestjs/microservices";
import {config} from "@cfg/config";
import {ExamplePayloadDto} from "@app/example-payload.dto";
import {AppService} from "@app/app.service";

@Controller()
export class AppController{

    constructor(
        private readonly appService: AppService,
    ) {
    }

    @EventPattern(config.get('kafka.topics.exampleTopic'), Transport.KAFKA)
    handleEvent(
        @Payload() payload: ExamplePayloadDto,
    ): Promise<void> {
        return this.appService.handleExampleEvent(payload.message);
    }
}