import { Box, Button, Card, Container, Flex, Text } from '@sanity/ui'
import { useLocation, useNavigate } from 'react-router'
import { removeTrailingSlash } from '../helpers/removeTrailingSlash'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Flex direction="column" style={{ height: `100vh` }}>
      <Card borderBottom style={{ flexShrink: 0 }}>
        <Container width={3}>
          <Flex
            style={{ flexShrink: 0 }}
            align="center"
            padding={3}
            paddingX={4}
          >
            <Box flex={1}>
              <Text weight="semibold" size={1}>
                Learn dashboard
              </Text>
            </Box>
            <Flex gap={1}>
              {[
                { path: '/cohorts', label: 'Cohorts' },
                { path: '/users', label: 'Users' },
                { path: '/feedback', label: 'Feedback' },
                { path: '/courses', label: 'Courses' },
                { path: '/review', label: 'Review' },
              ].map(({ path, label }) => {
                const isActive = removeTrailingSlash(
                  location.pathname,
                ).startsWith(path)

                return (
                  <Button
                    key={path}
                    onClick={() => navigate(path)}
                    text={label}
                    mode={isActive ? 'default' : 'bleed'}
                    tone={isActive ? 'primary' : 'default'}
                    padding={2}
                  />
                )
              })}
            </Flex>
          </Flex>
        </Container>
      </Card>
      <Flex direction="column" style={{ flex: 1 }}>
        {children}
      </Flex>
    </Flex>
  )
}
