import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { MapPin, Star, CalendarDays, DollarSign, ChevronLeft, ExternalLink, Info, MessageSquare, Send, Trash2 } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import StarRatingInput from '@/components/StarRatingInput';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const getPlaceDetails = async (id) => {
  const storedPlaces = localStorage.getItem('touristPlacesIndia');
  if (storedPlaces) {
    const places = JSON.parse(storedPlaces);
    const place = places.find(p => p.id === id);
    if (place) {
      const displayPrice = place.price === undefined || place.price === null || place.price < 0 ? 0 : place.price;
      return {
        ...place,
        price: displayPrice,
        longDescription: `${place.description} Located in the beautiful state of ${place.state}, this destination offers a unique blend of cultural heritage and natural beauty. Visitors can enjoy guided tours, local cuisine, and various recreational activities. The best time to visit is typically during pleasant weather seasons. Check local advisories for current visiting hours and entry fees.`,
        images: [
          `${place.imageSlug || 'default-gallery'}-1`,
          `${place.imageSlug || 'default-gallery'}-2`,
          `${place.imageSlug || 'default-gallery'}-3`,
        ],
        rating: place.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        reviewsCount: place.reviewsCount || Math.floor(Math.random() * 200) + 50,
        visitingHours: "9:00 AM - 5:00 PM (approx.)",
        entryFee: displayPrice > 0 ? `₹${displayPrice} per person (approx.)` : "Free Entry",
        nearestTransport: "Well connected by road. Nearest railway station and airport vary by location.",
        category: place.theme || "General Interest",
        coordinates: place.coordinates || { lat: 0, lng: 0 }
      };
    }
  }
  return null;
};

const TouristPlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchPlaceData = async () => {
    setLoading(true);
    try {
      const data = await getPlaceDetails(id);
      if (data) {
        setPlace(data);
        loadReviews(id);
      } else {
        toast({ variant: "destructive", title: "Error", description: "Place not found." });
        navigate('/places');
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load place details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaceData();
  }, [id, navigate, toast]);

  const loadReviews = (placeId) => {
    const allReviews = JSON.parse(localStorage.getItem('placeReviews')) || {};
    setReviews(allReviews[placeId] || []);
  };

  const updatePlaceRatingAndCount = (placeId, updatedReviews) => {
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = updatedReviews.length > 0 ? (totalRating / updatedReviews.length).toFixed(1) : (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    const newReviewsCount = updatedReviews.length;

    const storedPlaces = JSON.parse(localStorage.getItem('touristPlacesIndia')) || [];
    const updatedStoredPlaces = storedPlaces.map(p =>
      p.id === placeId ? { ...p, rating: newAverageRating, reviewsCount: newReviewsCount } : p
    );
    localStorage.setItem('touristPlacesIndia', JSON.stringify(updatedStoredPlaces));
    if (place && place.id === placeId) {
      setPlace(prev => ({ ...prev, rating: newAverageRating, reviewsCount: newReviewsCount }));
    }
  };


  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please log in to submit a review.' });
      navigate('/login');
      return;
    }
    if (newReviewText.trim() === '' || newReviewRating === 0) {
      toast({ variant: 'destructive', title: 'Incomplete Review', description: 'Please provide a rating and comment.' });
      return;
    }

    const review = {
      id: `review_${Date.now()}_${user.id}`,
      placeId: id,
      userId: user.id,
      userName: user.fullName,
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toISOString(),
    };

    const allReviews = JSON.parse(localStorage.getItem('placeReviews')) || {};
    const placeReviews = allReviews[id] || [];
    allReviews[id] = [review, ...placeReviews];
    localStorage.setItem('placeReviews', JSON.stringify(allReviews));

    setReviews(allReviews[id]);
    updatePlaceRatingAndCount(id, allReviews[id]);
    setNewReviewText('');
    setNewReviewRating(0);
    setShowReviewForm(false);
    toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });
  };

  const handleDeleteReview = (reviewId) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to delete reviews.' });
      return;
    }

    const allReviews = JSON.parse(localStorage.getItem('placeReviews')) || {};
    let placeReviews = allReviews[id] || [];

    const reviewToDelete = placeReviews.find(r => r.id === reviewId);
    if (!reviewToDelete) {
      toast({ variant: 'destructive', title: 'Error', description: 'Review not found.' });
      return;
    }
    if (reviewToDelete.userId !== user.id) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You can only delete your own reviews.' });
      return;
    }

    allReviews[id] = placeReviews.filter(r => r.id !== reviewId);
    localStorage.setItem('placeReviews', JSON.stringify(allReviews));
    setReviews(allReviews[id]);
    updatePlaceRatingAndCount(id, allReviews[id]);
    toast({ title: 'Review Deleted', description: 'Your review has been removed.' });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Place not found</h1>
        <Button onClick={() => navigate('/places')} className="mt-4">Back to Places</Button>
      </div>
    );
  }

  const openInGoogleMaps = () => {
    if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
      const googleMapsUrl = `${place.maplink}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      toast({ variant: "destructive", title: "Location Error", description: "Coordinates not available for this place." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-8"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>

      <ImageCarousel images={place.images} placeName={place.name} />

      <Card className="shadow-xl glassmorphic">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            <div>
              <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-1">
                {place.name}
              </CardTitle>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                <span>{place.location}, {place.state}</span>
              </div>
              <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-accent-foreground bg-accent/80 rounded-full">{place.category}</span>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0 space-y-2">
              <div className="flex items-center text-lg">
                <Star className="w-6 h-6 text-yellow-400 mr-1" />
                {place.rating = 0 ? <> 0 </> : <span className="font-semibold">{place.rating}</span>}
                <span className="text-sm text-muted-foreground ml-1">({place.reviewsCount} reviews)</span>
              </div>
              <div className="text-3xl font-bold text-primary flex items-center">
                {place.price > 0 ? <> ₹{place.price} </> : <span className="text-2xl">Free Entry</span>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardDescription className="text-lg text-foreground/90 leading-relaxed">
            {place.longDescription}
          </CardDescription>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground flex items-center"><Info className="w-5 h-5 mr-2 text-primary" /> Quick Info</h3>
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">Visiting Hours:</strong> {place.visitingHours}</p>
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">Entry Fee:</strong> {place.entryFee}</p>
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">Nearest Transport:</strong> {place.nearestTransport}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-foreground">Location</h3>
                <Button variant="outline" size="sm" onClick={openInGoogleMaps} disabled={!place.coordinates || !place.coordinates.lat}>
                  View on Google Maps <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {place.coordinates && place.coordinates.lat ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-12 h-12 text-primary" />
                    <p onClick={openInGoogleMaps} ><img onClick={openInGoogleMaps} src="/image.jpg" alt="Description" style={{ width: '50000px', marginLeft: '1px' }} />
                      Interactive Map Placeholder</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-12 h-12 text-gray-400" />
                    <p className="ml-2 text-lg">Map data not available</p>
                  </div>
                )}
              </div>
              {place.coordinates && place.coordinates.lat && <p className="text-xs text-muted-foreground mt-2"></p>}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-border">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg py-7 px-10 rounded-full shadow-lg transform hover:scale-105"
            onClick={() =>  navigate(`/booking/${place.id}`)}
          >
            <CalendarDays className="mr-2 h-6 w-6" /> {loading ? "Booking..." : "Book Now"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-xl glassmorphic">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <MessageSquare className="w-7 h-7 mr-3" />Reviews & Ratings
          </CardTitle>
          <CardDescription>See what other travelers are saying about {place.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showReviewForm && user && (
            <Button onClick={() => setShowReviewForm(true)} variant="outline" className="mb-4">
              <Send className="mr-2 h-4 w-4" /> Write a Review
            </Button>
          )}
          {!user && (
            <p className="text-sm text-muted-foreground">
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>Log in</Button> to write a review.
            </p>
          )}

          {showReviewForm && user && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              onSubmit={handleReviewSubmit} className="space-y-4 p-4 border rounded-lg bg-background/50"
            >
              <div>
                <Label htmlFor="rating" className="text-lg font-medium">Your Rating</Label>
                <StarRatingInput rating={newReviewRating} setRating={setNewReviewRating} />
              </div>
              <div>
                <Label htmlFor="reviewText" className="text-lg font-medium">Your Review</Label>
                <Textarea
                  id="reviewText"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder={`Share your experience at ${place.name}...`}
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Review</Button>
                <Button type="button" variant="ghost" onClick={() => setShowReviewForm(false)}>Cancel</Button>
              </div>
            </motion.form>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 border rounded-lg bg-card/80 shadow"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-col">
                      <h4 className="font-semibold text-primary">{review.userName}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    {user && user.id === review.userId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your review.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteReview(review.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{new Date(review.date).toLocaleDateString()}</p>
                  <p className="text-sm text-foreground/90">{review.text}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet for {place.name}. Be the first to share your experience!</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TouristPlaceDetailPage;