import { FathomContextType } from '../components/fathom-provider'

export function getPageviewsByPathname(
  stats: FathomContextType['stats'],
  pathname?: string,
) {
  if (!stats || 'error' in stats || !pathname) {
    return '0'
  }

  const allCoursePageviews = stats
    .filter((stat) => stat.pathname.startsWith(pathname))
    .reduce((acc, stat) => acc + Number(stat.pageviews), 0)
  const formattedPageviews =
    allCoursePageviews &&
    new Intl.NumberFormat('en-US').format(allCoursePageviews)

  return formattedPageviews
}
