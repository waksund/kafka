import {NestFactory} from "@nestjs/core";
import {config} from "@cfg/config";
import {AppModule} from "@app/app.module";
import {appStartup} from "./startup";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    appStartup(app);

    await app.startAllMicroservices();
    await app.listen(config.get('app.port'));
};

void bootstrap();