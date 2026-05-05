import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  className 
}: FeatureCardProps) {
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
          <Button 
            asChild 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href={href}>
              Get Started
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 