import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Eye, DollarSign, DownloadCloud } from 'lucide-react';

const TouristPlaceCard = ({ place, index }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExportToMaps = (e) => {
    e.stopPropagation();
    if (place.coordinates && typeof place.coordinates.lat === 'number' && typeof place.coordinates.lng === 'number') {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;
      window.open(googleMapsUrl, '_blank');
      toast({
        title: "Opening in Google Maps",
        description: `Showing ${place.name} on Google Maps.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: `Coordinates are not available for ${place.name}.`,
      });
    }
  };

  const canExport = place.coordinates && typeof place.coordinates.lat === 'number' && typeof place.coordinates.lng === 'number';
  const displayPrice = place.price === undefined || place.price === null || place.price < 0 ? 0 : place.price;


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="w-full"
    >
      <Card
        className="overflow-hidden h-full flex flex-col glassmorphic hover:shadow-primary/20 transition-shadow duration-300 cursor-pointer"
        onClick={() => navigate(`/places/${place.id}`)}
      >
        <div className="relative h-64 w-full">
          <img className="absolute inset-0 w-full h-full object-cover" alt={place.name} src={place.image}/>
          <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center">
             {displayPrice > 0 ? `₹${displayPrice}` : 'Free'}
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">{place.state}</div>
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{place.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span>{place.location}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-sm text-foreground/80 line-clamp-3">{place.description}</CardDescription>
        </CardContent>
        <CardFooter className="mt-auto flex flex-col sm:flex-row gap-2">
          <Button
            className="w-full sm:flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            onClick={(e) => { e.stopPropagation(); navigate(`/places/${place.id}`); }}
          >
            <Eye className="mr-2 h-5 w-5" /> View Details
          </Button>
          <Button
            variant="outline"
            className={`w-full sm:flex-1 border-primary text-primary hover:bg-primary/10 ${!canExport ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleExportToMaps}
            disabled={!canExport}
            title={!canExport ? "Coordinates not available" : "View on Google Maps"}
          >
            <DownloadCloud className="mr-2 h-5 w-5" /> View Map
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TouristPlaceCard;