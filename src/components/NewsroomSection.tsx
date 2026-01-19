import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp, Users, Briefcase, ArrowRight } from "lucide-react";

interface NewsItem {
  id: string;
  category: "company" | "hr" | "benefits" | "team";
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    category: "company",
    title: "Q2 2025 Company All-Hands Meeting",
    excerpt: "Join us next Friday for our quarterly update where leadership will share exciting updates about our growth and future plans.",
    date: "June 24, 2025",
    author: "Executive Team",
    readTime: "3 min read",
  },
  {
    id: "2",
    category: "benefits",
    title: "Enhanced Health Benefits Now Available",
    excerpt: "We're excited to announce expanded health coverage including mental health support and wellness programs for all employees.",
    date: "June 20, 2025",
    author: "HR Department",
    readTime: "5 min read",
  },
  {
    id: "3",
    category: "team",
    title: "Welcome Our New Engineering Team Members",
    excerpt: "Please join us in welcoming five talented engineers who joined our team this month. Learn more about their backgrounds and expertise.",
    date: "June 18, 2025",
    author: "Talent Team",
    readTime: "2 min read",
  },
];

const categoryConfig = {
  company: { icon: TrendingUp, variant: "default" as const },
  hr: { icon: Users, variant: "muted" as const },
  benefits: { icon: Briefcase, variant: "success" as const },
  team: { icon: Users, variant: "secondary" as const },
};

export function NewsroomSection() {
  return (
    <div className="relative space-y-4">
      {/* Overlay backdrop for emphasis */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg -z-10" />
      <div className="absolute inset-0 border-2 border-primary/20 rounded-lg -z-10" />
      
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Newsroom</h2>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
        {mockNews.slice(0, 2).map((news) => {
          const CategoryIcon = categoryConfig[news.category].icon;
          return (
            <Card
              key={news.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-primary/5"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={categoryConfig[news.category].variant}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {news.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground leading-relaxed">{news.readTime}</span>
                </div>
                <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {news.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground leading-relaxed">
                  <span>{news.author}</span>
                  <span>{news.date}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
