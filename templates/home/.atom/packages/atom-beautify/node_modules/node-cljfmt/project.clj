(defproject node-cljfmt "0.4.0"
  :description "A node script that reformats a file to proper clojure formatting"
  :url "http://github.com/snoe/node-cljfmt"

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.7.228"]
                 [cljfmt "0.5.3"]]

  :plugins [[lein-cljsbuild "1.1.2"]]

  :clean-targets ["target" "bin/cljfmt"]

  :cljsbuild {:builds [{:id "release"
                        :source-paths ["src"]
                        :compiler {:main node-cljfmt.main
                                   :asset-path "target"
                                   :verbose true
                                   :output-to "bin/cljfmt"
                                   :output-dir "target"
                                   :optimizations :advanced
                                   :target :nodejs}}]})
