const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['all', 'all-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['hk', 'hk-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /娓瘄hk|hongkong|kong kong|馃嚟馃嚢/i))
  }
  if (['tw', 'tw-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /鍙皘tw|taiwan|馃嚬馃嚰/i))
  }
  if (['Ai', 'Ai-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /Ai/i))
  }
  if (['Yt', 'Yt-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /Yt/i))
  }
  if (['jp', 'jp-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /鏃ユ湰|jp|japan|馃嚡馃嚨/i))
  }
  if (['sg', 'sg-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(鏂皘sg|singapore|馃嚫馃嚞)/i))
  }
  if (['us', 'us-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /缇巪us|unitedstates|united states|馃嚭馃嚫/i))
  }
  if (['au', 'au-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /婢硘au|unitedstates|united states|馃嚘馃嚭/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
