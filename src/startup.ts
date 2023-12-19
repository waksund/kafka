import {Transport} from "@nestjs/microservices";
import {config} from "@cfg/config";
import {INestApplication} from "@nestjs/common";

export function appStartup(app: INestApplication): void {
    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: config.get('kafka.clientId'),
                brokers: config.get('kafka.brokers'),
                retry: {
                    retries: config.get('kafka.retryCount'),
                },
            },
            consumer: {
                groupId: config.get('kafka.consumer.groupId'),
            },
        },
    });
}