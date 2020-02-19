# Validate error in format of:
# Error: resource 'digitalocean_domain.domain' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.ipv4_address

# Plan error in format of:
# Error: module root: 1 error(s) occurred:
#
# * resource 'digitalocean_domain.domain' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.ipv4_address

provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_domain" "domain" {
  name       = "www.example.com"
  ip_address = "${digitalocean_droplet.droplet.ipv4_address}"
}
