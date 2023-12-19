import {createProfiguration} from "@golevelup/profiguration";

type Config = {
    kafka: {
        clientId: string;
        brokers: string[];
        retryCount: number;
        consumer: {
            groupId: string;
        };
        topics: {
            exampleTopic: string;
        };
    };
    app: {
        port: number;
    };
};

export const config = createProfiguration<Config>(
    {
        kafka: {
            clientId: {
                default: 'example-client',
                format: String,
                env: 'KAFKA_CLIENT_ID',
            },
            brokers: {
                default: ['localhost:9093'],
                format: Array,
                env: 'KAFKA_BROKERS',
            },
            retryCount: {
                default: 1,
                format: Number,
                env: 'KAFKA_RETRY_COUNT',
            },
            consumer: {
                groupId: {
                    default: 'example-client',
                    format: String,
                    env: 'KAFKA_CONSUMER_GROUP_ID',
                },
            },
            topics: {
                exampleTopic: {
                    default: 'example-topic',
                    format: String,
                    env: 'KAFKA_EXAMPLE_TOPIC',
                }
            },
        },
        app: {
            port: {
                default: 3000,
                format: 'port',
                env: 'APP_PORT',
            },
        },
    },
    {
        strict: false,
        configureEnv: (env = 'local') => ({
            strict: false,
            files: [
                `.env.${env}`,
            ],
        }),
    },
);
