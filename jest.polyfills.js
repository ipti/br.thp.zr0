/* eslint-disable @typescript-eslint/no-require-imports -- require() em
   sequência é intencional aqui; ver comentário abaixo. Este arquivo não faz
   parte de `npm run lint` (escopo: src middleware.ts next.config.ts). */
// Executado via `setupFiles` (antes do ambiente de teste ser totalmente
// inicializado) para garantir que as primitivas de fetch/stream que o MSW
// (via @mswjs/interceptors) precisa já existam no global antes de `undici`
// ser carregado — usar `require` em sequência (não `import`) é necessário
// aqui porque imports ES são hoisted e executariam `undici` antes deste
// polyfill, quebrando seu próprio require.
//
// Importante: só define o global se ele ainda não existir. jest-environment-
// -jsdom já implementa MessageChannel/MessagePort nativamente, usados pelo
// scheduler do React (via `unstable_scheduleCallback`) — sobrescrever esses
// dois com a versão de `node:worker_threads` faz `render()` do React travar
// para sempre, porque o postMessage entre threads reais do Node não se
// comporta como o da jsdom/browser.
function setIfMissing(name, value) {
  if (typeof globalThis[name] === 'undefined') {
    globalThis[name] = value
  }
}

const { TextEncoder, TextDecoder } = require('node:util')
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web')
const { Blob } = require('node:buffer')

setIfMissing('TextEncoder', TextEncoder)
setIfMissing('TextDecoder', TextDecoder)
setIfMissing('ReadableStream', ReadableStream)
setIfMissing('TransformStream', TransformStream)
setIfMissing('WritableStream', WritableStream)
setIfMissing('Blob', Blob)
// MessagePort (exigido por undici para validações internas) e
// BroadcastChannel são seguros de complementar — apenas MessageChannel é
// deixado de fora deliberadamente (ver comentário acima sobre o scheduler).
const { MessagePort, BroadcastChannel } = require('node:worker_threads')
setIfMissing('MessagePort', MessagePort)
setIfMissing('BroadcastChannel', BroadcastChannel)

const { fetch, Headers, FormData, Request, Response } = require('undici')

setIfMissing('fetch', fetch)
setIfMissing('Headers', Headers)
setIfMissing('FormData', FormData)
setIfMissing('Request', Request)
setIfMissing('Response', Response)
