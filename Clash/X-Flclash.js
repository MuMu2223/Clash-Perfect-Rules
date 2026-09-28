const main = (config) => {

  // ================================================================
  // FlClash / Mihomo Perfect-Rules（兼容稳定版）
  // 支持：机场 + 自建 + proxy-providers
  // 默认：自动选择（全部节点测速）
  // ================================================================


  // 1. 基础配置
  config["mixed-port"] = 7890;
  config["mode"] = "rule";
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;
  config["log-level"] = "error";
  config["ipv6"] = false;
  config["allow-lan"] = false;
  config["find-process-mode"] = "always";
  config["keep-alive-interval"] = 30;
  config["keep-alive-idle"] = 30;
  config["disable-keep-alive"] = false;


  // 2. Profile
  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true
  };


  // 3. DNS
  config["dns"] = {
    "enable": true,
    "listen": "0.0.0.0:53",
    "prefer-h3": false,
    "ipv6": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "172.19.0.1/16",
    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "+.localhost",
      "+.home.arpa",
      "time.*.com",
      "time.*.gov",
      "pool.ntp.org",
      "+.push.apple.com",
      "mesu.apple.com",
      "swscan.apple.com",
      "captive.apple.com",
      "connectivitycheck.gstatic.com",
      "connectivitycheck.android.com",
      "www.msftconnecttest.com",
      "www.msftncsi.com"
    ],
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],
    "nameserver-policy": {
      "geosite:cn": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],
      "geosite:private": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],
      "geolocation-!cn": [
        "https://cloudflare-dns.com/dns-query",
        "https://dns.google/dns-query"
      ]
    },
    "proxy-server-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],
    "direct-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],
    "fallback": [
      "https://cloudflare-dns.com/dns-query",
      "https://dns.google/dns-query"
    ],
    "fallback-filter": {
      "geoip": true,
      "geoip-code": "CN",
      "geosite": ["gfw"],
      "domain": [
        "+.google.com",
        "+.googleapis.com",
        "+.googlevideo.com",
        "+.youtube.com",
        "+.github.com",
        "+.openai.com",
        "+.chatgpt.com",
        "+.anthropic.com",
        "+.claude.ai"
      ]
    }
  };


  // 4. TUN
  config["tun"] = {
    "enable": true,
    "device": "FlClash",
    "stack": "gvisor",
    "dns-hijack": ["0.0.0.0:53"],
    "auto-route": true,
    "auto-detect-interface": false,
    "strict-route": true,
    "mtu": 1280,
    "inet4-address": ["172.19.0.1/30"],
    "auto-redirect": false,
    "disable-icmp-forwarding": true
  };


  // 5. Sniffer
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "force-dns-mapping": true,
    "override-destination": true,
    "sniff": {
      "HTTP": { "ports": [80, "8080-8880"] },
      "TLS": { "ports": [443, 8443] },
      "QUIC": { "ports": [443, 8443] }
    },
    "skip-domain": ["+.push.apple.com", "+.mijia.cloud"]
  };


  // 6. NTP
  config["ntp"] = {
    "enable": true,
    "write-to-system": false,
    "server": "time.apple.com",
    "port": 123,
    "interval": 30
  };


  // 7. 清理无效节点
  if (Array.isArray(config["proxies"])) {
    config["proxies"] = config["proxies"].filter(function (p) {
      return p && typeof p.name === "string" && p.name.trim() !== "";
    });
  }


  // 8. 图标
  var iconBaseURL =
    "https://cdn.jsdelivr.net/gh/n0de-sudo/Perfect-Rules@main/Clash/icons/";

  var groupIcons = {
    "一键代理": "Proxy.png",
    "自动选择": "Proxy.png",
    "国内直连": "China.png",
    "AI": "AI.png",
    "YouTube": "YouTube.png",
    "Google": "Google.png",
    "GitHub": "GitHub.png",
    "网络检测": "Network-test.png",
    "Netflix": "Netflix.png",
    "Spotify": "Spotify.png",
    "Steam": "Steam.png",
    "Telegram": "Telegram.png",
    "TikTok": "TikTok.png",
    "Apple": "Apple.png",
    "Microsoft": "Microsoft.png",
    "香港": "Hong_Kong.png",
    "台湾": "Taiwan.png",
    "日本": "Japan.png",
    "新加坡": "Singapore.png",
    "韩国": "Korea.png",
    "美国": "United_States.png",
    "加拿大": "Other.png",
    "英国": "Other.png",
    "其他地区": "Other.png"
  };

  function getGroupIcon(name) {
    if (!groupIcons[name]) return undefined;
    return iconBaseURL + groupIcons[name];
  }


  // 9. 地区过滤
  var regionFilters = {
    "香港": "(?i)(香港|HKG?|Hong\\s*Kong|HongKong)",
    "台湾": "(?i)(台湾|台灣|TW|TPE|KHH|TSA|Taiwan|Taipei)",
    "日本": "(?i)(日本|JP|NRT|HND|KIX|CTS|FUK|Japan|Tokyo|Osaka)",
    "新加坡": "(?i)(新加坡|SG|SIN|XSP|Singapore)",
    "韩国": "(?i)(韩国|韓國|KR|ICN|GMP|PUS|Korea|Seoul)",
    "美国": "(?i)(美国|USA?|LAX|SFO|JFK|SJC|United\\s*States|America|Los\\s*Angeles|San\\s*Jose|New\\s*York)",
    "加拿大": "(?i)(加拿大|Canada|Toronto|Vancouver|Montreal)",
    "英国": "(?i)(英国|UK|United\\s*Kingdom|England|London|Manchester)"
  };

  var otherExclude =
    regionFilters["香港"] + "|" +
    regionFilters["台湾"] + "|" +
    regionFilters["日本"] + "|" +
    regionFilters["新加坡"] + "|" +
    regionFilters["韩国"] + "|" +
    regionFilters["美国"] + "|" +
    regionFilters["加拿大"] + "|" +
    regionFilters["英国"];


  // 10. 地区组
  var regionOrder = [
    "香港", "台湾", "日本", "新加坡", "韩国",
    "美国", "加拿大", "英国", "其他地区"
  ];

  var regionGroups = [];

  for (var i = 0; i < regionOrder.length; i++) {
    var region = regionOrder[i];
    var group = {
      name: region,
      type: "url-test",
      "include-all": true,
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      timeout: 5000,
      tolerance: 50,
      lazy: true,
      "max-failed-times": 3,
      "expected-status": 204
    };

    if (region === "其他地区") {
      group["exclude-filter"] = otherExclude;
    } else {
      group.filter = regionFilters[region];
    }

    var icon = getGroupIcon(region);
    if (icon) group.icon = icon;

    regionGroups.push(group);
  }


  // 11. 自动选择（全部节点，默认最优）
  var autoSelectGroup = {
    name: "自动选择",
    type: "url-test",
    "include-all": true,
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    timeout: 5000,
    tolerance: 50,
    lazy: true,
    "max-failed-times": 3,
    "expected-status": 204
  };

  var autoIcon = getGroupIcon("自动选择");
  if (autoIcon) autoSelectGroup.icon = autoIcon;


  // 12. 国内直连
  var domesticDirectGroup = {
    name: "国内直连",
    type: "select",
    proxies: ["DIRECT"]
  };

  var domesticIcon = getGroupIcon("国内直连");
  if (domesticIcon) domesticDirectGroup.icon = domesticIcon;


  // 13. 一键代理 + 业务组（默认都指向「自动选择」）
  var availableTargets = ["自动选择"]
    .concat(regionOrder)
    .concat(["国内直连"]);

  var mainSelector = {
    name: "一键代理",
    type: "select",
    proxies: availableTargets
  };

  var mainIcon = getGroupIcon("一键代理");
  if (mainIcon) mainSelector.icon = mainIcon;

  function createBusinessGroup(name) {
    var group = {
      name: name,
      type: "select",
      proxies: availableTargets
    };
    var icon = getGroupIcon(name);
    if (icon) group.icon = icon;
    return group;
  }

  var businessGroups = [
    createBusinessGroup("AI"),
    createBusinessGroup("YouTube"),
    createBusinessGroup("Google"),
    createBusinessGroup("GitHub"),
    createBusinessGroup("Netflix"),
    createBusinessGroup("Spotify"),
    createBusinessGroup("Steam"),
    createBusinessGroup("Telegram"),
    createBusinessGroup("TikTok"),
    createBusinessGroup("Apple"),
    createBusinessGroup("Microsoft"),
    createBusinessGroup("网络检测")
  ];


  // 14. 最终顺序：自动选择 → 一键代理 → 国内直连 → 业务组 → 地区组
  config["proxy-groups"] = [autoSelectGroup, mainSelector, domesticDirectGroup]
    .concat(businessGroups)
    .concat(regionGroups);


  // 15. Rule Providers
  var ruleBaseURL =
    "https://cdn.jsdelivr.net/gh/n0de-sudo/Perfect-Rules@main/Clash/rules/";

  function createRuleProvider(filename) {
    return {
      type: "http",
      behavior: "classical",
      format: "yaml",
      url: ruleBaseURL + filename,
      path: "./rules/" + filename,
      interval: 86400
    };
  }

  config["rule-providers"] = {
    "AI": createRuleProvider("ai.yaml"),
    "YouTube": createRuleProvider("youtube.yaml"),
    "Google": createRuleProvider("google.yaml"),
    "GitHub": createRuleProvider("github.yaml"),
    "Netflix": createRuleProvider("netflix.yaml"),
    "Spotify": createRuleProvider("spotify.yaml"),
    "Steam": createRuleProvider("steam.yaml"),
    "Telegram": createRuleProvider("telegram.yaml"),
    "TikTok": createRuleProvider("tiktok.yaml"),
    "Apple": createRuleProvider("apple.yaml"),
    "Microsoft": createRuleProvider("microsoft.yaml"),
    "NetworkTest": createRuleProvider("network-test.yaml")
  };


  // 16. Rules
  config["rules"] = [
    "DOMAIN-SUFFIX,lan,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,localhost,DIRECT",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",

    "RULE-SET,NetworkTest,网络检测",
    "RULE-SET,AI,AI",
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Google,Google",
    "RULE-SET,GitHub,GitHub",
    "RULE-SET,Netflix,Netflix",
    "RULE-SET,Spotify,Spotify",
    "RULE-SET,Steam,Steam",
    "RULE-SET,Telegram,Telegram",
    "RULE-SET,TikTok,TikTok",
    "RULE-SET,Apple,Apple",
    "RULE-SET,Microsoft,Microsoft",

    "GEOSITE,private,国内直连",
    "GEOIP,private,国内直连,no-resolve",
    "GEOSITE,cn,国内直连",
    "GEOIP,cn,国内直连,no-resolve",

    "MATCH,一键代理"
  ];


  return config;
};
