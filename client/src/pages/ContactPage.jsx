import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists or will be created
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin as MapPinIcon, Send } from 'lucide-react';

// Create Textarea if it doesn't exist
const TextareaComponent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      ref={ref}
      {...props}
    />
  );
});
TextareaComponent.displayName = 'Textarea';


const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    console.log('Contact form submitted:', formData);
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };
  const [result, setResult] = React.useState("");
  //https://script.google.com/macros/s/AKfycbzbwC1kU5UWdLjgzqJdL9dHd3xJB1QcwfVK6pQsgn1Hop9I3jO9T8SRdGLUipvaCZj3JQ/exec
  const onSubmit = async (event) => {
    event.preventDefault();
    const url = "https://script.google.com/macros/s/AKfycbzbwC1kU5UWdLjgzqJdL9dHd3xJB1QcwfVK6pQsgn1Hop9I3jO9T8SRdGLUipvaCZj3JQ/exec"
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: (`Name=${event.target.name.value}&Email=${event.target.email.value}`)
    }).then(res => res.text()).then(data => {
      alert(data)
    }).catch(error => console.log(error))

    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "42f3dc7e-7bd4-468a-a2b4-e492004097fa");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully", formData);
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' }); // Reset form
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  const contactInfo = [
    { icon: <MapPinIcon className="w-8 h-8 text-primary" />, title: 'Our Office', details: 'Chennai' },
    { icon: <Phone className="w-8 h-8 text-primary" />, title: 'Call Us', details: '7305852492' },
    { icon: <Mail className="w-8 h-8 text-primary" />, title: 'Email Us', details: 'siva7305852@gmail.com' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 py-8"
    >
      <section className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
          Get In Touch
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help! Whether you have a question about our services, need assistance with a booking, or just want to say hello.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {contactInfo.map((item, index) => (
            <Card key={index} className="p-6 glassmorphic hover:shadow-primary/20 transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.details}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="w-full shadow-2xl glassmorphic">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Send Us a Message</CardTitle>
              <CardDescription className="text-center text-muted-foreground">Fill out the form below and we'll reply shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your Name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter Your Email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <TextareaComponent id="message" name="message" placeholder="How can we help You?" required />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg py-6">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;