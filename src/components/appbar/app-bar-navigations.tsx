'use client'

import React, { FC, memo, ReactElement, useEffect, useMemo, useState } from 'react'

// components
import Link from 'next/link'
import Box from '@mui/material/Box'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// interfaces
import { Theme } from '@mui/material/styles'

// hooks
import { usePathname } from 'next/navigation'

// constants
import { companyMenus } from '@/constants/menus'

interface LinkItemProps extends Props {
  label: string
  path: string
  icon?: ReactElement
  isActive?: boolean
}

const LinkItem: FC<LinkItemProps> = ({
  label,
  path,
  icon,
  isActive = false,
}: LinkItemProps) => {
  const pathName = usePathname()

  const handleNavigationClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const [basePath, hash] = path.split('#')
    const sectionId = hash?.trim()

    if (pathName !== '/' || basePath !== '/' || !sectionId) {
      return
    }

    const targetSection =
      document.getElementById(sectionId) ??
      document.getElementById(`home-${sectionId}`)

    if (!targetSection) {
      return
    }

    event.preventDefault()
    window.history.replaceState(null, '', path)
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <MuiLink
      href={path}
      component={Link}
      onClick={handleNavigationClick}
      sx={{
        py: 0.8,
        px: 1.8,
        mx: 0.4,
        borderRadius: 10,
        cursor: 'pointer',
        overflow: 'hidden',
        alignItems: 'center',
        position: 'relative',
        color: 'text.primary',
        textDecoration: 'none',
        display: 'inline-block',
        // Icon
        '& svg': {
          fontSize: 18,
          transform: 'translateX(-32px)',
          position: 'absolute',
          top: '8px',
          transition: (theme: Theme) =>
            theme.transitions.create(['transform', 'margin']),
        },

        // Styles for active menu
        ...(isActive && {
          backgroundColor: 'primary.main',
          color: '#fbfbfb',
        }),

        '&:hover': {
          backgroundColor: 'primary.main',
          color: '#fbfbfb',
          '& svg': {
            transform: 'translateX(0px)',
          },
          '& p': {
            marginLeft: '26px',
          },
        },
      }}
    >
      {icon}
      <Typography
        variant='h6'
        component='p'
        sx={{
          fontSize: 14,
          display: 'inline-block',
          color: 'inherit',
          marginLeft: '0',
          transition: (theme: Theme) => theme.transitions.create(['margin']),
        }}
      >
        {label}
      </Typography>
    </MuiLink>
  )
}
const MemoizedLinkItem = memo(LinkItem)

interface Props {}

const AppBarNavigation: FC<Props> = () => {
  const pathName = usePathname()
  const [activePath, setActivePath] = useState(pathName)

  const sectionMenus = useMemo(
    () => companyMenus.filter((menu) => menu.path.startsWith('/#')),
    []
  )

  useEffect(() => {
    setActivePath(pathName)
  }, [pathName])

  useEffect(() => {
    if (pathName !== '/') {
      return
    }

    const resolveSections = () =>
      sectionMenus
        .map((menu) => {
          const sectionId = menu.path.split('#')[1]?.trim()
          if (!sectionId) {
            return null
          }

          const sectionElement =
            document.getElementById(sectionId) ??
            document.getElementById(`home-${sectionId}`)

          if (!sectionElement) {
            return null
          }

          return {
            path: menu.path,
            top: sectionElement.getBoundingClientRect().top + window.scrollY,
          }
        })
        .filter((section): section is { path: string; top: number } => Boolean(section))

    const updateActiveSection = () => {
      const sections = resolveSections().sort((a, b) => a.top - b.top)
      if (sections.length === 0) {
        setActivePath('/')
        return
      }

      const offsetTop = window.scrollY + 140
      let currentPath = '/'

      for (const section of sections) {
        if (offsetTop >= section.top) {
          currentPath = section.path
        }
      }

      setActivePath(currentPath)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [pathName, sectionMenus])

  return (
    <Box sx={{ mx: 'auto' }}>
      <Box
        component='ul'
        sx={{
          m: 0,
          lineHeight: 0,
          pl: 0,
        }}
      >
        {companyMenus.map((item, index) => (
          <MemoizedLinkItem
            key={String(index)}
            label={item.label}
            path={item.path}
            icon={item.icon}
            isActive={activePath === item.path}
          />
        ))}
      </Box>
    </Box>
  )
}

export default memo(AppBarNavigation)
