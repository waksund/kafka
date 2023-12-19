import {
  GenericContainer,
  Network,
  StartedTestContainer,
} from 'testcontainers';

import { config } from '@cfg/config';

import {KafkaContainer} from "@testcontainers/kafka";

export async function kafkaSetup(): Promise<StartedTestContainer[]> {
    const network = await new Network().start();

    const zooKeeperHost = "zookeeper";
    const zooKeeperPort = 2181;
    const zookeeperContainer = await new GenericContainer("confluentinc/cp-zookeeper:7.3.2")
        .withNetwork(network)
        .withNetworkAliases(zooKeeperHost)
        .withEnvironment({ ZOOKEEPER_CLIENT_PORT: zooKeeperPort.toString() })
        .withExposedPorts(zooKeeperPort)
        .start();

    const kafkaPort = 9093;
    const kafkaContainer = await new KafkaContainer()
        .withNetwork(network)
        .withZooKeeper(zooKeeperHost, zooKeeperPort)
        .withExposedPorts(kafkaPort)
        .start();

    const externalPort = kafkaContainer.getMappedPort(kafkaPort);

    config.set('kafka.brokers', [`localhost:${externalPort}`]);

    return [
        zookeeperContainer,
        kafkaContainer,
    ];
}
