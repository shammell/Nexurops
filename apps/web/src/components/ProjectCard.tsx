'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency } from '@/lib/utils'
import type { Project } from '@/types'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: Project
}

const statusColors = {
  active: 'success',
  completed: 'default',
  'on-hold': 'warning',
  cancelled: 'destructive',
} as const

export function ProjectCard({ project }: ProjectCardProps) {
  const budgetPercentage = (project.budgetUsed / project.budgetTotal) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <Badge variant={statusColors[project.status]}>
              {project.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium">
                {formatCurrency(project.budgetUsed)} / {formatCurrency(project.budgetTotal)}
              </span>
            </div>
            <Progress value={budgetPercentage} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Team:</span>
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers.length > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{project.teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/projects/${project.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
