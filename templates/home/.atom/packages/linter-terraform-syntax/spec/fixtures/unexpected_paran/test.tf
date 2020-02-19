module "eks" {
  subnets = "${module.vpc.private_subnets)}"
}
