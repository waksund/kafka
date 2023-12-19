import { StartedTestContainer } from 'testcontainers';
import {INestApplication} from "@nestjs/common";
import {Kafka, logLevel, Producer} from "kafkajs";
import {DeepMockProxy, mockDeep} from "jest-mock-extended";
import {AppService} from "@app/app.service";
import {kafkaSetup} from "./utils/kafka.setup";
import {config} from "@cfg/config";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "@app/app.module";
import {appStartup} from "../src/startup";
import {ExamplePayloadDto} from "@app/example-payload.dto";

describe('CallbackController', () => {
    let app: INestApplication;
    let kafka: Kafka;
    let appService: DeepMockProxy<AppService>;
    let producer: Producer;
    let kafkaContainers: StartedTestContainer[];

    beforeAll(async () => {
        kafkaContainers = await kafkaSetup();

        kafka = new Kafka({
            clientId: 'mock',
            brokers: config.get('kafka.brokers'),
            logLevel: logLevel.NOTHING,
        });
        producer = kafka.producer();
        await producer.connect();

        const admin = kafka.admin();
        await admin.connect();
        await admin.createTopics({
            topics: [{ topic: config.get('kafka.topics.exampleTopic') }],
        });

        appService = mockDeep<AppService>();

        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AppService)
            .useValue(appService)
            .compile();

        app = module.createNestApplication();
        appStartup(app);
        await app.startAllMicroservices();

        await app.init();

    }, 30 * 1000);

    afterAll(async () => {
        await app.close();
        await Promise.all(kafkaContainers.map(c => c.stop()));
    }, 15 * 1000);

    describe('handleEvent', () => {
        it('should call appService', async () => {
            let resolve: (value: unknown) => void;
            const promise = new Promise((res) => {
                resolve = res;
            });
            appService.handleExampleEvent.mockImplementation(async () => {
                resolve(0);
            });

            const event: ExamplePayloadDto = {
                message: 'Hello World!',
            };

            await producer.send({
                topic: config.get('kafka.topics.exampleTopic'),
                messages: [{
                    key: 'key',
                    value: JSON.stringify(event),
                }]
            });

            await promise;

            await kafka.producer().disconnect();
        });
    });
});