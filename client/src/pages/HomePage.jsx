import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, CalendarDays, Mountain, Waves, Castle, Leaf, Globe, Compass } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 glassmorphic"
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );

  const ThemeCard = ({ icon, name, imageSlug, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, boxShadow: "0px 15px 25px rgba(0,0,0,0.1)" }}
      className="rounded-xl overflow-hidden shadow-lg cursor-pointer glassmorphic group"
      onClick={() => navigate('/places')}
    >
      <div className="relative h-48 w-full">
        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={name} src={`https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400&h=300&fit=crop&auto=format&dpr=1&placeholder=${imageSlug}`} />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
          <h4 className="text-lg font-semibold text-white">{name}</h4>
        </div>
      </div>
    </motion.div>
  );

  const StateCard = ({ name, imageSlug, delay }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="rounded-xl overflow-hidden shadow-lg cursor-pointer glassmorphic group aspect-[3/2]"
      onClick={() => navigate('/places')}
    >
      <div className="relative h-full w-full">
        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={name} src={`https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400&h=300&fit=crop&auto=format&dpr=1&placeholder=${imageSlug}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h4 className="absolute bottom-4 left-4 text-xl font-bold text-white">{name}</h4>
      </div>
    </motion.div>
  );


  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center py-16 md:py-24 rounded-3xl bg-gradient-to-tr from-primary via-purple-600 to-accent shadow-2xl overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="relative z-10">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-5xl md:text-7xl font-extrabold text-primary-foreground mb-6 tracking-tight"
          >
            Explore Incredible India
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
            className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto"
          >
            Discover breathtaking places and create unforgettable memories. Your next Indian adventure starts here!
          </motion.p>
          {user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-semibold text-yellow-300 mb-8"
            >
              Welcome back, {user.fullName}!
            </motion.p>
          )}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
          >
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
              onClick={() => navigate('/places')}
            >
              <Compass className="mr-2 h-6 w-6" /> Discover Places
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Explore by Theme</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ThemeCard icon={<Mountain />} name="Adventure" imageSlug="Himalayas-trekking" delay={0.1} />
          <ThemeCard icon={<Waves />} name="Beaches" imageSlug="Goa-beach" delay={0.2} />
          <ThemeCard icon={<Castle />} name="Historical" imageSlug="Rajasthan-fort" delay={0.3} />
          <ThemeCard icon={<Leaf />} name="Nature" imageSlug="Kerala-backwaters" delay={0.4} />
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Discover by State</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StateCard name="Rajasthan" imageSlug="Jaipur-Hawa-Mahal" delay={0.1} />
          <StateCard name="Kerala" imageSlug="Munnar-tea-plantations" delay={0.2} />
          <StateCard name="Himachal Pradesh" imageSlug="Shimla-scenic-view" delay={0.3} />
          <StateCard name="Goa" imageSlug="Palolem-beach-huts" delay={0.4} />
          <StateCard name="Tamil Nadu" imageSlug="Madurai-Meenakshi-Temple" delay={0.5} />
          <StateCard name="Uttar Pradesh" imageSlug="Taj-Mahal-Agra" delay={0.6} />
        </div>
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/places')}
          >
            <Globe className="mr-2 h-6 w-6" /> View All Destinations
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Why Choose TourBook?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MapPin />}
            title="Vast Selection"
            description="Explore a wide variety of curated tourist spots across India, from hidden gems to popular landmarks."
            delay={0.2}
          />
          <FeatureCard
            icon={<Search />}
            title="Easy Search"
            description="Quickly find your perfect Indian destination with our intuitive search and filtering options."
            delay={0.4}
          />
          <FeatureCard
            icon={<CalendarDays />}
            title="Seamless Booking"
            description="Book your trips effortlessly with our secure and user-friendly booking system."
            delay={0.6}
          />
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold text-center mb-6 text-foreground">Featured Indian Destinations</h2>
        <p className="text-lg text-muted-foreground mb-8">Get inspired by some of our most popular locations in India.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-xl overflow-hidden shadow-lg glassmorphic"
          >
            <img className="w-full h-64 object-cover" alt="Taj Mahal" src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=400&fit=crop&auto=format&dpr=1&placeholder=Taj-Mahal-India" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Taj Mahal, Agra</h3>
              <p className="text-muted-foreground text-sm">An ivory-white marble mausoleum, a symbol of eternal love.</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-xl overflow-hidden shadow-lg glassmorphic"
          >
            <img className="w-full h-64 object-cover" alt="Kerala Backwaters" src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=400&fit=crop&auto=format&dpr=1&placeholder=Kerala-backwaters-houseboat" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Kerala Backwaters</h3>
              <p className="text-muted-foreground text-sm">Cruise through serene backwaters on a traditional houseboat.</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-xl overflow-hidden shadow-lg glassmorphic md:col-span-2 lg:col-span-1"
          >
            <img className="w-full h-64 object-cover" alt="Jaipur City Palace" src="/jaipur.jpg" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Jaipur, Rajasthan</h3>
              <p className="text-muted-foreground text-sm">Explore the Pink City's majestic forts and vibrant markets.</p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;