import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MapPin, 
  Building2, 
  Settings2, 
  Plus, 
  Search,
  Shield,
  Clock,
  Smartphone,
  Monitor,
  AlertTriangle,
  Check,
  Info,
  Save,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Location {
  id: string;
  name: string;
  address: string;
  radius: number;
  policy: "allow-flag" | "warn-flag" | "block";
  requireGps: boolean;
  flagDistance: number;
  flagAccuracy: number;
  offlineReviewHours: number;
}

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Main Store",
    address: "123 Main Street, City Center",
    radius: 200,
    policy: "warn-flag",
    requireGps: true,
    flagDistance: 50,
    flagAccuracy: 100,
    offlineReviewHours: 24,
  },
  {
    id: "2",
    name: "Warehouse East",
    address: "456 Industrial Blvd, East District",
    radius: 100,
    policy: "block",
    requireGps: true,
    flagDistance: 25,
    flagAccuracy: 50,
    offlineReviewHours: 12,
  },
  {
    id: "3",
    name: "Downtown Office",
    address: "789 Business Ave, Suite 500",
    radius: 150,
    policy: "allow-flag",
    requireGps: false,
    flagDistance: 100,
    flagAccuracy: 150,
    offlineReviewHours: 48,
  },
];

const GeofenceSettings = () => {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateLocation = (updates: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === selectedLocationId ? { ...loc, ...updates } : loc
      )
    );
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Location and geofence settings have been updated.",
    });
  };

  const getPolicyLabel = (policy: Location["policy"]) => {
    switch (policy) {
      case "allow-flag":
        return "Allow & Flag";
      case "warn-flag":
        return "Warn & Flag";
      case "block":
        return "Block Punch";
    }
  };

  const getPolicyBadge = (policy: Location["policy"]) => {
    switch (policy) {
      case "allow-flag":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Allow & Flag</Badge>;
      case "warn-flag":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warn & Flag</Badge>;
      case "block":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Block</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Locations & Geofencing</h1>
        <p className="text-muted-foreground">
          Configure work locations and geofence policies for time tracking
        </p>
      </div>

      <Tabs defaultValue="locations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="punch-settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Punch Settings
          </TabsTrigger>
        </TabsList>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Work Locations</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[500px] overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <motion.button
                      key={location.id}
                      onClick={() => setSelectedLocationId(location.id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedLocationId === location.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{location.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {location.address}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {getPolicyBadge(location.policy)}
                            <Badge variant="secondary" className="text-xs">
                              {location.radius}m
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Config Panel */}
            {selectedLocation && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {selectedLocation.name}
                  </CardTitle>
                  <CardDescription>{selectedLocation.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Location Name</Label>
                      <Input
                        id="name"
                        value={selectedLocation.name}
                        onChange={(e) => updateLocation({ name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={selectedLocation.address}
                        onChange={(e) => updateLocation({ address: e.target.value })}
                        placeholder="Search for an address..."
                      />
                    </div>
                  </div>

                  {/* Map Preview Placeholder */}
                  <div className="bg-muted rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Map preview with geofence radius</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Radius: {selectedLocation.radius}m
                      </p>
                    </div>
                  </div>

                  {/* Geofence Radius */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        Geofence Radius
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Area around the location where punches are valid</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Badge variant="outline">{selectedLocation.radius}m</Badge>
                    </div>
                    <Slider
                      value={[selectedLocation.radius]}
                      onValueChange={([value]) => updateLocation({ radius: value })}
                      min={50}
                      max={1000}
                      step={25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50m</span>
                      <span>500m</span>
                      <span>1000m</span>
                    </div>
                  </div>

                  {/* Policy Settings */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      Outside Geofence Policy
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>What happens when an employee punches outside the geofence</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <RadioGroup
                      value={selectedLocation.policy}
                      onValueChange={(value: Location["policy"]) => updateLocation({ policy: value })}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="allow-flag" id="allow-flag" className="mt-1" />
                        <div>
                          <Label htmlFor="allow-flag" className="font-medium cursor-pointer">
                            Allow and flag for review
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Punch is saved but flagged for manager review
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="warn-flag" id="warn-flag" className="mt-1" />
                        <div>
                          <Label htmlFor="warn-flag" className="font-medium cursor-pointer">
                            Warn employee and flag
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Show warning before allowing punch, then flag for review
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="block" id="block" className="mt-1" />
                        <div>
                          <Label htmlFor="block" className="font-medium cursor-pointer">
                            Block punch
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Prevent punching entirely when outside geofence
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* GPS Requirement */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Require GPS metadata</Label>
                      <p className="text-sm text-muted-foreground">
                        All punches must include GPS data for this location
                      </p>
                    </div>
                    <Switch
                      checked={selectedLocation.requireGps}
                      onCheckedChange={(checked) => updateLocation({ requireGps: checked })}
                    />
                  </div>

                  {/* Exception Rules */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="exception-rules">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Exception Thresholds
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Flag punches more than X meters outside fence</Label>
                          <Select
                            value={selectedLocation.flagDistance.toString()}
                            onValueChange={(value) => updateLocation({ flagDistance: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25">25 meters</SelectItem>
                              <SelectItem value="50">50 meters</SelectItem>
                              <SelectItem value="100">100 meters</SelectItem>
                              <SelectItem value="200">200 meters</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Flag punches when GPS accuracy worse than</Label>
                          <Select
                            value={selectedLocation.flagAccuracy.toString()}
                            onValueChange={(value) => updateLocation({ flagAccuracy: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="50">±50 meters</SelectItem>
                              <SelectItem value="100">±100 meters</SelectItem>
                              <SelectItem value="150">±150 meters</SelectItem>
                              <SelectItem value="200">±200 meters</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Require manager review for offline punches older than</Label>
                          <Select
                            value={selectedLocation.offlineReviewHours.toString()}
                            onValueChange={(value) => updateLocation({ offlineReviewHours: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6 hours</SelectItem>
                              <SelectItem value="12">12 hours</SelectItem>
                              <SelectItem value="24">24 hours</SelectItem>
                              <SelectItem value="48">48 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Punch Settings Tab */}
        <TabsContent value="punch-settings">
          <div className="grid gap-6 max-w-3xl">
            {/* Rounding Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Rounding
                </CardTitle>
                <CardDescription>
                  Configure how punch times are rounded for payroll
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rounding Rule</Label>
                  <Select defaultValue="nearest-15">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exact">Exact time (no rounding)</SelectItem>
                      <SelectItem value="nearest-5">Nearest 5 minutes</SelectItem>
                      <SelectItem value="nearest-10">Nearest 10 minutes</SelectItem>
                      <SelectItem value="nearest-15">Nearest 15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Example: A punch at 9:07 AM would round to 9:00 AM (nearest 15)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grace Periods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Grace Periods
                </CardTitle>
                <CardDescription>
                  Allow flexibility around scheduled start/end times
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Before scheduled start</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No grace period</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="7">7 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>After scheduled end</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No grace period</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="7">7 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Punch Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Allowed Punch Methods
                </CardTitle>
                <CardDescription>
                  Select which methods employees can use to clock in/out
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Web Clock</p>
                      <p className="text-sm text-muted-foreground">Browser-based time clock</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-muted-foreground">iOS and Android apps</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Physical Kiosk</p>
                      <p className="text-sm text-muted-foreground">On-site time clock terminals</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location Privacy</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employee location data is only captured at the moment of punch. We do not track 
                      employees continuously. Location data is stored securely and used only for 
                      verifying work attendance. Employees can see what data is collected about them 
                      in their profile settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeofenceSettings;
