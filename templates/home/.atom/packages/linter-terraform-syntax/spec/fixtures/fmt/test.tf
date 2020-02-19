# for messing up formatting and verifying it is fixed
provider "aws" {
  region = "us-east-2"
}

resource "aws_instance" "example" {
  ami           = "AMI"
  instance_type = "t2.micro"
}
