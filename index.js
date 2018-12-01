const aws = require("@pulumi/aws");

let size = "t2.micro";     // t2.micro is available in the AWS free tier
let ami  = "ami-0f9cf087c1f27d9b1"; // AMI for Ubuntu in us-east-1 (Virginia)

let group = new aws.ec2.SecurityGroup("rabbitmq-secgrp", { 
  ingress: [
      { protocol: "tcp", fromPort: 0, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
      { protocol: "tcp", fromPort: 0, toPort: 65535, cidrBlocks: ["0.0.0.0/0"] }, 
  ],
  egress: [
      { protocol: 'tcp', fromPort: 0, toPort: 65535, cidrBlocks: ["0.0.0.0/0"] }
  ]
});

let userData = 
`#!/bin/bash
sudo apt-get install rabbitmq-server
sudo rabbitmqctl cluster_status
`;

let server = new aws.ec2.Instance("rabbitmq", {
  instanceType: size,
  securityGroups: [ group.name ], // reference the group object above
  ami: ami,
  keyName: 'rabbitmq'
});

exports.publicIp = server.publicIp;
exports.publicHostName = server.publicDns;