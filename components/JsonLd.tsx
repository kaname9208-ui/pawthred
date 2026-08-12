// 注入 JSON-LD 结构化数据，帮助 Google 在搜索结果展示星级/价格/库存等富媒体
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
