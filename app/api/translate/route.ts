import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text, from, to } = (await req.json()) as {
    text: string
    from: 'es' | 'zh'
    to: 'es' | 'zh'
  }

  if (!text?.trim()) {
    return NextResponse.json({ translated: '' })
  }

  const langPair = `${from === 'zh' ? 'zh-CN' : from}|${to === 'zh' ? 'zh-CN' : to}`

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
    )
    const data = await res.json()
    const translated = data?.responseData?.translatedText || text

    return NextResponse.json({ translated })
  } catch {
    return NextResponse.json({ translated: text })
  }
}
