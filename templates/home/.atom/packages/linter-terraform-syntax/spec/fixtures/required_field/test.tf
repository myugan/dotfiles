# Validate error in format of
# Errors:
#
#   * digitalocean_floating_ip.float: "region": required field is not set
#   * digitalocean_floating_ip.float: droplet_id: cannot parse '' as int: strconv.ParseInt: parsing "droplet": invalid syntax

# Plan error in format of
# Error: digitalocean_floating_ip.float: "region": required field is not set
#
#
#
# Error: digitalocean_floating_ip.float: droplet_id: cannot parse '' as int: strconv.ParseInt: parsing "droplet": invalid syntax

provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_floating_ip" "float" {
  droplet_id = "droplet"
}
