import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Package, Calendar, User, Folder, Key, FileText, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { ProcessGetResponse } from 'uipath-sdk';
interface ProcessConfigurationProps {
  process: ProcessGetResponse;
}
export function ProcessConfiguration({ process }: ProcessConfigurationProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch {
      return 'Invalid date';
    }
  };
  const configSections = [
    {
      title: 'Basic Information',
      icon: <FileText className="h-5 w-5 text-primary" />,
      items: [
        { label: 'Name', value: process.name || 'N/A', icon: <Tag className="h-4 w-4" /> },
        { label: 'Display Name', value: process.displayName || process.name || 'N/A', icon: <Tag className="h-4 w-4" /> },
        { label: 'Key', value: process.key || 'N/A', icon: <Key className="h-4 w-4" /> },
        { label: 'Description', value: process.description || 'No description provided', icon: <FileText className="h-4 w-4" /> },
        { label: 'Version', value: process.version || 'N/A', icon: <Package className="h-4 w-4" /> }
      ]
    },
    {
      title: 'Metadata',
      icon: <Settings className="h-5 w-5 text-primary" />,
      items: [
        { label: 'Process ID', value: process.id?.toString() || 'N/A', icon: <Key className="h-4 w-4" /> },
        { label: 'Environment', value: process.environmentName || 'Default', icon: <Folder className="h-4 w-4" /> },
        { label: 'Created', value: formatDate(process.creationTime), icon: <Calendar className="h-4 w-4" /> },
        { label: 'Last Modified', value: formatDate(process.lastModifiedTime), icon: <Calendar className="h-4 w-4" /> },
        { label: 'Author', value: process.author || 'Unknown', icon: <User className="h-4 w-4" /> }
      ]
    }
  ];
  return (
    <div className="space-y-6">
      {/* Process Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>Process Status</CardTitle>
          </div>
          <CardDescription>
            Current status and availability information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Available
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline">
                Automation Process
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Execution</p>
              <Badge variant="outline">
                On Demand
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Configuration Sections */}
      {configSections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {section.icon}
              <CardTitle>{section.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-muted-foreground">
                      {item.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground break-all">
                        {item.value}
                      </p>
                    </div>
                  </div>
                  {itemIndex < section.items.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      {/* Additional Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Runtime Configuration</CardTitle>
          </div>
          <CardDescription>
            Process execution and runtime settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Execution Settings</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Timeout</span>
                  <Badge variant="outline">No Limit</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge variant="outline">Normal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Robot Selection</span>
                  <Badge variant="outline">Any Available</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Input Arguments</h4>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  No input arguments configured for this process.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}