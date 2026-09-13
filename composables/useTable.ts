export function useTable<T>(source: Ref<T[]> | ComputedRef<T[]>, options: {
  pageSize?: number
  search?: Ref<string>
  filter?: (item: T, query: string) => boolean
} = {}) {
  const page = ref(1)
  const pageSize = options.pageSize ?? 10
  const sortKey = ref<string>('')
  const sortDir = ref<'asc' | 'desc'>('asc')

  const filtered = computed(() => {
    const query = options.search?.value.trim().toLowerCase() ?? ''
    const items = source.value
    if (!query || !options.filter) return items
    return items.filter(item => options.filter!(item, query))
  })

  watch(filtered, () => {
    const maxPage = Math.max(1, Math.ceil(filtered.value.length / pageSize))
    if (page.value > maxPage) page.value = maxPage
  })

  const rows = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

  function sortBy(key: string, getter: (item: T) => string | number) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
    const dir = sortDir.value === 'asc' ? 1 : -1
    const copy = [...(Array.isArray(source.value) ? source.value : source.value)]
    copy.sort((a, b) => {
      const av = getter(a)
      const bv = getter(b)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    if (isRef(source) && Array.isArray(source.value)) {
      ;(source as Ref<T[]>).value = copy
    }
  }

  return reactive({ page, pageSize, rows, filtered, pageCount, sortKey, sortDir, sortBy })
}

export function usePageReady(ms = 350) {
  const ready = ref(false)
  onMounted(() => {
    window.setTimeout(() => {
      ready.value = true
    }, ms)
  })
  return ready
}
