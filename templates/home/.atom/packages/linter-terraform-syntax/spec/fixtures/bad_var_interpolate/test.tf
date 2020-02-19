# this syntax error test exists because it has an alternate output format
# Validate error in form of
# Error: Error loading /home/matt/git_repos/linter-terraform-syntax/spec/fixtures/bad_var_interpolate/test.tf: error parsing local value "kube_config_static" at 8:24: parse error at 5:7: expected ")" but found opening quote

# Plan error in format of
# Error: Failed to load root config module: Error loading /home/matt/git_repos/linter-terraform-syntax/spec/fixtures/bad_var_interpolate/test.tf: error parsing local value "kube_config_static" at 8:24: parse error at 5:7: expected ")" but found opening quote

locals {
  kube_config_static = "${merge(
    var.kube_config_static,
    map(
      "client_cert", "${file("${kube_config_path}/../client-cert.pem")}"
      "client_key", "${file("${kube_config_path}/../client-key.pem")}"
      "cluster_ca_cert", "${file("${kube_config_path}/../cluster-ca-cert.pem")}"
    )
  )}"
}
