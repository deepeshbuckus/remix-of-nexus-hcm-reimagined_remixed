import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, TrendingUp, Briefcase, Users } from "lucide-react";

interface NewsItem {
  id: string;
  category: "company" | "benefits" | "policy" | "team";
  title: string;
  date: string;
  readTime?: string;
}

interface NewsWidgetProps {
  horizontal?: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    category: "company",
    title: "Q2 2025 Company All-Hands Meeting",
    date: "June 24",
    readTime: "3 min",
  },
  {
    id: "2",
    category: "benefits",
    title: "Enhanced Health Benefits Available",
    date: "June 20",
    readTime: "5 min",
  },
  {
    id: "3",
    category: "policy",
    title: "Updated Remote Work Policy",
    date: "June 18",
    readTime: "4 min",
  },
  {
    id: "4",
    category: "team",
    title: "Welcome New Team Members",
    date: "June 15",
    readTime: "2 min",
  },
];

const categoryConfig = {
  company: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  benefits: { icon: Briefcase, color: "text-success", bg: "bg-success/10" },
  policy: { icon: MessageSquare, color: "text-warning-foreground", bg: "bg-warning/10" },
  team: { icon: Users, color: "text-accent-foreground", bg: "bg-accent/10" },
};

export function NewsWidget({ horizontal = false }: NewsWidgetProps) {
  if (horizontal) {
    return (
      <Card className="bg-muted/30 border-muted shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Company News</h3>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:text-primary">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockNews.map((news) => {
              const CategoryIcon = categoryConfig[news.category].icon;
              return (
                <Card
                  key={news.id}
                  className="group hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${categoryConfig[news.category].bg} shrink-0`}>
                        <CategoryIcon className={`h-4 w-4 ${categoryConfig[news.category].color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="text-[10px] px-1.5 py-0 h-4 capitalize border-muted-foreground/20"
                          >
                            {news.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{news.date}</span>
                        </div>
                        
                        <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h4>
                        
                        {news.readTime && (
                          <p className="text-xs text-muted-foreground">{news.readTime} read</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/30 border-muted shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Company News</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:text-primary">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-2">
        {mockNews.map((news, index) => {
          const CategoryIcon = categoryConfig[news.category].icon;
          return (
            <div
              key={news.id}
              className={`group p-3 -mx-3 rounded-lg hover:bg-background/80 transition-all cursor-pointer ${
                index !== mockNews.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-md ${categoryConfig[news.category].bg} shrink-0 mt-0.5`}>
                  <CategoryIcon className={`h-3 w-3 ${categoryConfig[news.category].color}`} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-1.5 py-0 h-4 capitalize border-muted-foreground/20"
                    >
                      {news.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{news.date}</span>
                  </div>
                  
                  <h4 className="text-xs font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h4>
                  
                  {news.readTime && (
                    <p className="text-[10px] text-muted-foreground">{news.readTime} read</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
