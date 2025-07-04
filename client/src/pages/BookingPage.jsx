import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { CalendarDays, Users, CreditCard, MapPin, DollarSign, CheckCircle } from 'lucide-react';

const getPlaceDetails = async (id) => {
  const storedPlaces = localStorage.getItem('touristPlacesIndia'); // Corrected localStorage key
  if (storedPlaces) {
    const places = JSON.parse(storedPlaces);
    return places.find(p => p.id === id) || null;
  }
  return null;
};

const BookingPage = () => {
  const { placeId } = useParams();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [place, setPlace] = useState(null);
  const [dateOfVisit, setDateOfVisit] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [email, setEmail] = useState('');

  const handleBooking = async () => {
      setLoading(true);
      try {
        axios.post(`http://localhost:3000/api/booking/${placeId}`, {
          userId: user.id,
          placeId:place.id,
          userName: e.target.userName.value,
          email: email,
          date: new Date()
        });
  
        if (res.data.success) {
          toast.success(res.data.message, {
            position: "top-center"
          });
        } else {
          toast.error("Booking failed. Please try again.");
        }
      } catch (err) {
        toast.error("Server error!");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to make a booking.' });
      navigate('/login');
      return;
    }

    const fetchPlace = async () => {
      setLoading(true);
      const placeData = await getPlaceDetails(placeId);
      if (placeData) {
        setPlace(placeData);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Place not found.' });
        navigate('/places');
      }
      setLoading(false);
    };
    fetchPlace();
  }, [placeId, user, navigate, toast]);

  const [result, setResult] = React.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  await axios.post(`http://localhost:3000/api/booking/${placeId}`, {
  placeName: place.name,
  userName: e.target.userName.value,
  email: email,
  phone: e.target.phone.value,
  dateOfVisit,
  numberOfPeople,
  paymentMethod,
})

    .then(result => console.log(result))
    .catch(err => console.log(err))

    setResult("Sending....");
    const formData = new FormData(e.target);

    formData.append("access_key", "42f3dc7e-7bd4-468a-a2b4-e492004097fa");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (place.success) {
      setResult("Form Submitted Successfully");
      e.target.reset();
    }
    if (!place) return;

    const bookingDetails = {
      id: `booking_${Date.now()}_${user.id}_${place.id}`,
      userId: user.id,
      placeId: place.id,
      placeName: place.name,
      dateOfVisit,
      numberOfPeople,
      totalPrice: place.price * numberOfPeople,
      paymentMethod,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
    };

    const existingBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
    localStorage.setItem('userBookings', JSON.stringify([...existingBookings, bookingDetails]));

    setIsBooked(true);
    toast({ title: 'Booking Successful!', description: `Your trip to ${place.name} is confirmed.` });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div></div>;
  }

  if (!place) {
    return <div className="text-center py-10"><h1 className="text-2xl">Place not found.</h1></div>;
  }
  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center"
      >
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-primary mb-4">Booking Confirmed!</h1>
        <p className="text-xl text-muted-foreground mb-2">Your adventure to <span className="font-semibold text-accent">{place.name}</span> is all set.</p>
        <p className="text-lg text-muted-foreground mb-8">Date: {new Date(dateOfVisit).toLocaleDateString()}, Guests: {numberOfPeople}</p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/')} variant="outline">Go to Homepage</Button>
          <Button onClick={() => navigate('/bookings')}>View My Bookings</Button>
        </div>
      </motion.div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12"
    >
      <Card className="w-full max-w-2xl shadow-2xl glassmorphic">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Book Your Trip</CardTitle>
          <CardDescription className="text-muted-foreground">Confirm details for your adventure to <span className="font-semibold text-primary">{place.name}</span>.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border border-primary/30 rounded-lg bg-primary/5">
            <h3 className="text-xl font-semibold text-primary flex items-center"><MapPin className="w-5 h-5 mr-2" />{place.name}</h3>
            <p className="text-muted-foreground">{place.location}</p>
            <p className="text-lg font-medium text-accent mt-1 flex items-center"><DollarSign className="w-5 h-5 mr-1" />{place.price > 0 ? `₹${place.price}` : 'Free'} / person</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center">{place.name}</h3>
              <Input id={place.name} name={place.name} />
            </div>
            <div>
              <Label htmlFor="name" className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-primary" />Name</Label>
              <Input id="userName" name="userName" type="name" placeholder="Enter Your Name" />
            </div>
            <div>
              <Label htmlFor="text" className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-primary" />Phone number</Label>
              <Input id="phone" name="phone number" type="text" placeholder="Enter Your Phone number" required />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-primary" />Email Address</Label>
              <Input id="email" name="email" type="text" onChange={(e) => setEmail(e.target.value)}
                required placeholder="Enter Your Email" />
            </div>
            <div>
              <Label htmlFor="dateOfVisit" className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-primary" />Date of Visit</Label>
              <Input id="dateOfVisit" name="dateOfVisit" type="date" value={dateOfVisit} onChange={(e) => setDateOfVisit(e.target.value)} required
                min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <Label htmlFor="numberOfPeople" className="flex items-center"><Users className="w-4 h-4 mr-2 text-primary" />Number of People</Label>
              <Input id="numberOfPeople" name="numberOfPeople" type="number" min="1" value={numberOfPeople} onChange={(e) => setNumberOfPeople(parseInt(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="paymentMethod" className="flex items-center"><CreditCard className="w-4 h-4 mr-2 text-primary" />Payment Method</Label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="creditCard">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bankTransfer">Bank Transfer</option>
              </select>
            </div>
            <div className="text-2xl font-bold text-right text-primary">
              Total: ₹{place.price * numberOfPeople}
            </div>
            <Button onClick={handleBooking} disabled={loading} type="submit" name="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg py-6">
             {loading ? "Booking..." : " Confirm Booking"} 
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            By clicking "Confirm Booking", you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BookingPage;
