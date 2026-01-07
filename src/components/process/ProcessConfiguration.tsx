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
        { label: 'Title', value: process.title || process.name || 'N/A', icon: <Tag className="h-4 w-4" /> },
        { label: 'Key', value: process.key || 'N/A', icon: <Key className="h-4 w-4" /> },
        { label: 'Description', value: process.description || 'No description provided', icon: <FileText className="h-4 w-4" /> },
        { label: 'Version', value: process.processVersion || 'N/A', icon: <Package className="h-4 w-4" /> }
      ]
    },
    {
      title: 'Metadata',
      icon: <Settings className="h-5 w-5 text-primary" />,
      items: [
        { label: 'Process ID', value: process.id?.toString() || 'N/A', icon: <Key className="h-4 w-4" /> },
        { label: 'Environment', value: process.environmentId?.toString() || 'Default', icon: <Folder className="h-4 w-4" /> },
        { label: 'Published', value: formatDate(process.published), icon: <Calendar className="h-4 w-4" /> },
        { label: 'Last Modified', value: formatDate(process.lastModifiedTime), icon: <Calendar className="h-4 w-4" /> },
        { label: 'Is Latest Version', value: process.isLatestVersion ? 'Yes' : 'No', icon: <User className="h-4 w-4" /> }
      ]
    }
  ];
  return (
    <div className="space-y-6">
      {/* Process Status Overview */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Process Status</CardTitle>
              <CardDescription className="text-sm">
                Current status and availability information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                Available
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Automation Process
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Execution</p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                On Demand
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Configuration Sections */}
      {configSections.map((section, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                {section.icon}
              </div>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 rounded bg-muted/50">
                      {item.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground break-all leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                  {itemIndex < section.items.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      {/* Additional Configuration */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Runtime Configuration</CardTitle>
              <CardDescription className="text-sm">
                Process execution and runtime settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Execution Settings
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Timeout</span>
                  <Badge variant="outline" className="bg-background">No Limit</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge variant="outline" className="bg-background">Normal</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Robot Selection</span>
                  <Badge variant="outline" className="bg-background">Any Available</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Input Arguments
              </h4>
              <div className="p-4 rounded-lg bg-muted/30 border-dashed border-2 border-muted">
                <div className="text-sm text-muted-foreground text-center">
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