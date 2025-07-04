import React, { useState, useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useNavigate } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Briefcase, CalendarDays, Users, MapPin, DollarSign, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
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

    const BookingsListPage = () => {
      const { user, loading: authLoading } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [bookings, setBookings] = useState([]);
      const [loading, setLoading] = useState(true);

      const fetchBookings = () => {
        if (!user) return;
        setLoading(true);
        try {
          const storedBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
          const userBookings = storedBookings.filter(booking => booking.userId === user.id);
          userBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
          setBookings(userBookings);
          if (userBookings.length > 0 && !loading) { // Avoid toast on initial load if already shown
             // toast({ title: 'Bookings Refreshed', description: 'Your booking list is up to date.' });
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load your bookings." });
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if (authLoading) return;

        if (!user) {
          toast({ variant: 'destructive', title: 'Access Denied', description: 'Please log in to view your bookings.' });
          navigate('/login');
          return;
        }
        fetchBookings();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user, authLoading, navigate, toast]);


      const handleCancelBooking = (bookingId) => {
        try {
          const storedBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
          const updatedBookings = storedBookings.map(booking =>
            booking.id === bookingId ? { ...booking, status: 'cancelled', cancellationDate: new Date().toISOString() } : booking
          );
          localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
          fetchBookings(); // Re-fetch to update the list
          toast({ title: 'Booking Cancelled', description: 'Your booking has been successfully cancelled.' });
        } catch (error) {
          console.error("Failed to cancel booking:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not cancel the booking." });
        }
      };
      
      const getStatusBadge = (status) => {
        switch (status) {
          case 'confirmed':
            return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Confirmed</span>;
          case 'cancelled':
            return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Cancelled</span>;
          default:
            return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Unknown</span>;
        }
      };


      if (loading || authLoading) {
        return (
          <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
          </div>
        );
      }
      
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <Briefcase className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">My Bookings</h1>
            <p className="text-lg text-muted-foreground mt-2">Review your upcoming and past adventures.</p>
          </div>

          {bookings.length === 0 ? (
            <Card className="text-center py-12 glassmorphic">
              <CardHeader>
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <CardTitle className="text-2xl">No Bookings Yet</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  You haven't booked any trips yet. Start exploring and plan your next getaway!
                </CardDescription>
                <Button onClick={() => navigate('/places')} className="mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Explore Places
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {confirmedBookings.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Active Bookings</h2>
                  <div className="space-y-6">
                    {confirmedBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-2xl text-primary">{booking.placeName}</CardTitle>
                              {getStatusBadge(booking.status)}
                            </div>
                            <CardDescription>
                              Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-accent" /><span>Date of Visit: {new Date(booking.dateOfVisit).toLocaleDateString()}</span></div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-accent" /><span>Guests: {booking.numberOfPeople}</span></div>
                            <div className="flex items-center"><DollarSign className="w-5 h-5 mr-2 text-accent" /><span>Total Price: ${booking.totalPrice}</span></div>
                            <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-accent" /><span>Payment: {booking.paymentMethod.replace(/([A-Z])/g, ' $1').trim()}</span></div>
                          </CardContent>
                          <CardFooter>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently cancel your booking for {booking.placeName}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCancelBooking(booking.id)} className="bg-destructive hover:bg-destructive/90">
                                    Yes, Cancel Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {cancelledBookings.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">Cancelled Bookings</h2>
                  <div className="space-y-6">
                    {cancelledBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="shadow-lg glassmorphic opacity-70">
                          <CardHeader>
                             <div className="flex justify-between items-start">
                              <CardTitle className="text-2xl text-muted-foreground line-through">{booking.placeName}</CardTitle>
                              {getStatusBadge(booking.status)}
                            </div>
                            <CardDescription>
                              Cancelled on: {booking.cancellationDate ? new Date(booking.cancellationDate).toLocaleDateString() : 'N/A'} (Booked: {new Date(booking.bookingDate).toLocaleDateString()})
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                            <div className="flex items-center"><CalendarDays className="w-5 h-5 mr-2" /><span>Date of Visit: {new Date(booking.dateOfVisit).toLocaleDateString()}</span></div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-2" /><span>Guests: {booking.numberOfPeople}</span></div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </motion.div>
      );
    };

    export default BookingsListPage;