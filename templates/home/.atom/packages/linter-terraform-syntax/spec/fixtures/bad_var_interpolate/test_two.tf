# this syntax error test exists because it has an alternate output format
# Validate error in form of
# Error: Error loading /home/matt/git_repos/linter-terraform-syntax/spec/fixtures/bad_var_interpolate/test.tf: error parsing local value "kube_config_static" at 8:24: parse error at 5:7: expected ")" but found opening quote

# Plan error in format of
# Error: Failed to load root config module: Error loading /home/matt/git_repos/linter-terraform-syntax/spec/fixtures/bad_var_interpolate/test.tf: error parsing local value "kube_config_static" at 8:24: parse error at 5:7: expected ")" but found opening quote
provider "aws" {
  region = "us-east-2"
}

resource "aws_instance" "example" {
  ami           = "AMI"
  instance_type = "t2.micro"
}
