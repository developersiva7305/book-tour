import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import TouristPlaceCard from '@/components/TouristPlaceCard';

const allIndianPlaces = [
  // Andhra Pradesh
  { id: 'ap1', name: 'Tirupati Temple', image: "/thirupathi.jpg", maplink: "https://maps.app.goo.gl/JBG5SxeS9som5ZkY9", description: 'Famous Vedic temple dedicated to Lord Venkateswara.', price: 0, imageSlug: 'tirupati-temple-spiritual-andhra', location: 'Tirupati, Andhra Pradesh', coordinates: { lat: 13.6288, lng: 79.4192 }, state: "Andhra Pradesh", theme: "Pilgrimage" },
  { id: 'ap2', name: 'Araku Valley', image: "/Araku Valley.jpg", maplink: "https://maps.app.goo.gl/fYk3roDHdT28Gfoo7", description: 'Picturesque hill station known for coffee plantations and tribal culture.', price: 150, imageSlug: 'araku-valley-hills-andhra', location: 'Visakhapatnam, Andhra Pradesh', coordinates: { lat: 18.3335, lng: 82.8667 }, state: "Andhra Pradesh", theme: "Nature" },
  { id: 'ap3', name: 'Amaravati', image: "/Amaravati.jpg", maplink: "https://maps.app.goo.gl/4uPFh23hPGKofdah9", description: 'Historic city, a center for Buddhist culture and art.', price: 50, imageSlug: 'amaravati-buddhist-stupa-andhra', location: 'Guntur, Andhra Pradesh', coordinates: { lat: 16.5730, lng: 80.3570 }, state: "Andhra Pradesh", theme: "Historical" },
  { id: 'ap4', name: 'Gandikota (Grand Canyon of India)', image: "/Gandikota.jpg", maplink: "https://maps.app.goo.gl/pZXNmgZbBJc7czop7", description: 'Stunning gorge formed by River Penna, with ancient fort ruins.', price: 100, imageSlug: 'gandikota-canyon-fort-andhra', location: 'Kadapa, Andhra Pradesh', coordinates: { lat: 14.8165, lng: 78.2830 }, state: "Andhra Pradesh", theme: "Nature" },
  // Arunachal Pradesh
  { id: 'ar1', name: 'Tawang Monastery', image: "/Arna Travels - Famous Tawang Monastery .jpg", maplink: "https://maps.app.goo.gl/KFL6boFXsX2zhipw6", description: 'Largest monastery in India, offering breathtaking mountain views.', price: 50, imageSlug: 'tawang-monastery-buddhist-arunachal', location: 'Tawang, Arunachal Pradesh', coordinates: { lat: 27.5857, lng: 91.8592 }, state: "Arunachal Pradesh", theme: "Pilgrimage" },
  { id: 'ar2', name: 'Ziro Valley', image: "/ziro valley.jpg", maplink: "https://maps.app.goo.gl/7src4r7B6sTwbJTj6", description: 'Lush green valley, home to the Apatani tribe, known for rice cultivation.', price: 200, imageSlug: 'ziro-valley-fields-arunachal', location: 'Lower Subansiri, Arunachal Pradesh', coordinates: { lat: 27.6300, lng: 93.8300 }, state: "Arunachal Pradesh", theme: "Nature" },
  { id: 'ar3', name: 'Namdapha National Park', image: "/Namdapha National Park.jpg", maplink: "https://maps.app.goo.gl/14pL9ELDwqDZGwvN8", description: 'Biodiversity hotspot with diverse flora and fauna, including tigers and leopards.', price: 300, imageSlug: 'namdapha-national-park-wildlife-arunachal', location: 'Changlang, Arunachal Pradesh', coordinates: { lat: 27.4900, lng: 96.4800 }, state: "Arunachal Pradesh", theme: "Wildlife" },
  { id: 'ar4', name: 'Sela Pass', image: "/Snow capped Tawang.jpg", maplink: "https://maps.app.goo.gl/UPPFNpL1NrjSw5uN6", description: 'High-altitude mountain pass offering stunning views of snow-capped peaks and lakes.', price: 0, imageSlug: 'sela-pass-mountains-arunachal', location: 'Tawang, Arunachal Pradesh', coordinates: { lat: 27.4980, lng: 92.1030 }, state: "Arunachal Pradesh", theme: "Nature" },
  // Assam
  { id: 'as1', name: 'Kaziranga National Park', image: "/Kaziranga National Park in Assam, INDIA.jpg", maplink: "https://maps.app.goo.gl/E9BJjwZhxFor2mVJ9", description: 'Home to two-thirds of the world\'s one-horned rhinoceroses.', price: 250, imageSlug: 'kaziranga-rhino-wildlife-assam', location: 'Golaghat, Assam', coordinates: { lat: 26.5775, lng: 93.1710 }, state: "Assam", theme: "Wildlife" },
  { id: 'as2', name: 'Kamakhya Temple', image: "/Maa Kamakhya Temple, Guwahati.jpg", maplink: "https://maps.app.goo.gl/S8SVDHiBhDPWeT5v8", description: 'A major Hindu pilgrimage site dedicated to Goddess Kamakhya.', price: 0, imageSlug: 'kamakhya-temple-guwahati-assam', location: 'Guwahati, Assam', coordinates: { lat: 26.1664, lng: 91.7059 }, state: "Assam", theme: "Pilgrimage" },
  { id: 'as3', name: 'Majuli Island', image: "/Majuli - Assam Tourism.jpg", maplink: "https://maps.app.goo.gl/a835d3dUhScFCntT7", description: 'World\'s largest river island, known for its Vaishnavite culture and serene beauty.', price: 100, imageSlug: 'majuli-island-river-assam', location: 'Majuli, Assam', coordinates: { lat: 26.9100, lng: 94.1900 }, state: "Assam", theme: "Nature" },
  { id: 'as4', name: 'Manas National Park', image: "/Manas National Park Assam.jpg", maplink: "https://maps.app.goo.gl/HUGHCiVPbMvAQuC39", description: 'UNESCO World Heritage site, a tiger and elephant reserve.', price: 200, imageSlug: 'manas-national-park-tiger-assam', location: 'Baksa, Assam', coordinates: { lat: 26.7500, lng: 90.9300 }, state: "Assam", theme: "Wildlife" },
  // Bihar
  { id: 'br1', name: 'Bodh Gaya', image: "/Bodh Gaya Tourism.jpeg", maplink: "https://maps.app.goo.gl/wotL2rb8wPYKfdaW9", description: 'UNESCO site where Buddha attained Enlightenment under the Bodhi tree.', price: 0, imageSlug: 'bodh-gaya-mahabodhi-bihar', location: 'Gaya, Bihar', coordinates: { lat: 24.6959, lng: 84.9912 }, state: "Bihar", theme: "Pilgrimage" },
  { id: 'br2', name: 'Nalanda University ruins', image: "/Nalanda University Ruins in Bihar, India.jpg", maplink: "https://maps.app.goo.gl/sTNmwvPwVFdshi1r5", description: 'Ancient center of learning, showcasing rich historical and architectural heritage.', price: 50, imageSlug: 'nalanda-university-ruins-bihar', location: 'Nalanda, Bihar', coordinates: { lat: 25.1350, lng: 85.4430 }, state: "Bihar", theme: "Historical" },
  { id: 'br3', name: 'Rajgir', image: "/Ghatora Katora, Rajgir _ Bihar.jpg",maplink: "https://maps.app.goo.gl/D7VTwY5fkqoKbCp49", description: 'Historic town with Buddhist and Jain significance, hot springs, and ropeway.', price: 100, imageSlug: 'rajgir-hills-bihar', location: 'Nalanda, Bihar', coordinates: { lat: 25.0300, lng: 85.4200 }, state: "Bihar", theme: "Historical" },
  { id: 'br4', name: 'Vaishali', image: "/Vaishali _ The Cradle of Democracy.jpg",maplink: "https://maps.app.goo.gl/9WXTPT2bMY9D7N3R6", description: 'Ancient city, considered one of the first republics, important for Buddhism and Jainism.', price: 30, imageSlug: 'vaishali-stupa-bihar', location: 'Vaishali, Bihar', coordinates: { lat: 25.9900, lng: 85.1200 }, state: "Bihar", theme: "Historical" },
  // Chhattisgarh
  { id: 'cg1', name: 'Chitrakote Falls', image: "/Chitrakote falls - India.jpg",maplink: "https://maps.app.goo.gl/ZrpmEfamqzzVQ2E78", description: 'India\'s widest waterfall, often called the Niagara of India.', price: 50, imageSlug: 'chitrakote-falls-chhattisgarh', location: 'Bastar, Chhattisgarh', coordinates: { lat: 19.2000, lng: 81.7000 }, state: "Chhattisgarh", theme: "Nature" },
  { id: 'cg2', name: 'Barnawapara Wildlife Sanctuary', image: "/barwanapara wildlife sanc.jpg",maplink: "https://maps.app.goo.gl/nNVNFJsE3gThmkUF8", description: 'Rich in diverse flora and fauna, including tigers, leopards, and sloth bears.', price: 150, imageSlug: 'barnawapara-wildlife-chhattisgarh', location: 'Mahasamund, Chhattisgarh', coordinates: { lat: 21.4167, lng: 82.4167 }, state: "Chhattisgarh", theme: "Wildlife" },
  { id: 'cg3', name: 'Bhoramdeo Temple', image: "/Bhoramdeo Temple.jpg",maplink: "https://maps.app.goo.gl/71yUzWYrwu3Qr1oy5", description: 'Ancient temple complex dedicated to Lord Shiva, known as the Khajuraho of Chhattisgarh.', price: 20, imageSlug: 'bhoramdeo-temple-chhattisgarh', location: 'Kabirdham, Chhattisgarh', coordinates: { lat: 22.1000, lng: 81.0200 }, state: "Chhattisgarh", theme: "Historical" },
  { id: 'cg4', name: 'Sirpur', image: "/Sirpur Chhattisgarh.jpg",maplink: "https://maps.app.goo.gl/D513wBQ5j9P8sVLX6", description: 'Archaeological site with ancient temples, monasteries, and Buddhist viharas.', price: 30, imageSlug: 'sirpur-ruins-chhattisgarh', location: 'Mahasamund, Chhattisgarh', coordinates: { lat: 21.3300, lng: 82.1800 }, state: "Chhattisgarh", theme: "Historical" },
  // Goa
  { id: 'ga1', name: 'Baga and Calangute Beaches', image: "/Calatagan, Batangas_ Paradise Found.jpg",maplink: "https://maps.app.goo.gl/D513wBQ5j9P8sVLX6", description: 'Famous beaches known for vibrant nightlife, water sports, and shacks.', price: 0, imageSlug: 'baga-calangute-beaches-goa', location: 'North Goa, Goa', coordinates: { lat: 15.5559, lng: 73.7518 }, state: "Goa", theme: "Beaches" },
  { id: 'ga2', name: 'Basilica of Bom Jesus', image: "/The Basilica of Bom Jesus.jpg",maplink: "https://maps.app.goo.gl/tfUEQQBGEMPxAFU56", description: 'UNESCO World Heritage site, holding the mortal remains of St. Francis Xavier.', price: 0, imageSlug: 'basilica-bom-jesus-goa', location: 'Old Goa, Goa', coordinates: { lat: 15.5009, lng: 73.9116 }, state: "Goa", theme: "Historical" },
  { id: 'ga3', name: 'Fort Aguada', image: "/Aguada fort goa.jpg",maplink: "https://maps.app.goo.gl/kW61mM3hEYRi5hFD9", description: 'Well-preserved 17th-century Portuguese fort with a lighthouse.', price: 50, imageSlug: 'fort-aguada-goa', location: 'Candolim, Goa', coordinates: { lat: 15.4930, lng: 73.7730 }, state: "Goa", theme: "Historical" },
  { id: 'ga4', name: 'Dudhsagar Waterfalls', image: "/dudhsagar waterfalls.jpg",maplink: "https://maps.app.goo.gl/sfNKdkszEiMRzzHz5", description: 'Majestic four-tiered waterfall located on the Mandovi River.', price: 100, imageSlug: 'dudhsagar-waterfalls-goa', location: 'South Goa, Goa', coordinates: { lat: 15.3145, lng: 74.3140 }, state: "Goa", theme: "Nature" },
  // Gujarat
  { id: 'gj1', name: 'Statue of Unity', image: "/statue of unity.jpg",maplink: "https://maps.app.goo.gl/1M9dtG6PJvMGTHiz6", description: 'World\'s tallest statue, depicting Sardar Vallabhbhai Patel.', price: 350, imageSlug: 'statue-of-unity-gujarat', location: 'Narmada, Gujarat', coordinates: { lat: 21.8380, lng: 73.7191 }, state: "Gujarat", theme: "Historical" },
  { id: 'gj2', name: 'Gir National Park', image: "/gir national park gate.jpg",maplink: "https://maps.app.goo.gl/SboZPBc5NP8pR5ge9", description: 'The only natural habitat of the Asiatic lions.', price: 200, imageSlug: 'gir-national-park-lions-gujarat', location: 'Junagadh, Gujarat', coordinates: { lat: 21.1667, lng: 70.8333 }, state: "Gujarat", theme: "Wildlife" },
  { id: 'gj3', name: 'Somnath Temple', image: "/Somnath Temple.jpg",maplink: "https://maps.app.goo.gl/6byHU7j3HrC2DGbY6", description: 'One of the twelve Jyotirlinga shrines of Lord Shiva, an important pilgrimage site.', price: 0, imageSlug: 'somnath-temple-gujarat', location: 'Somnath, Gujarat', coordinates: { lat: 20.8880, lng: 70.4013 }, state: "Gujarat", theme: "Pilgrimage" },
  { id: 'gj4', name: 'Rann of Kutch', image: "/rann of kutch.jpg",maplink: "https://maps.app.goo.gl/L1qfZpCPRKAJPoYa6", description: 'Vast salt marsh, famous for the Rann Utsav and unique landscape.', price: 100, imageSlug: 'rann-of-kutch-gujarat', location: 'Kutch, Gujarat', coordinates: { lat: 23.7337, lng: 70.0000 }, state: "Gujarat", theme: "Nature" },
  // Haryana
  { id: 'hr1', name: 'Kurukshetra', image: "/Kurukshetra.jpg",maplink: "https://maps.app.goo.gl/HWAwBpn6ahoJNs138", description: 'Historic land of the Mahabharata war, with numerous religious sites.', price: 0, imageSlug: 'kurukshetra-brahma-sarovar-haryana', location: 'Kurukshetra, Haryana', coordinates: { lat: 29.9695, lng: 76.8783 }, state: "Haryana", theme: "Pilgrimage" },
  { id: 'hr2', name: 'Sultanpur Bird Sanctuary', image: "/Sultanpur Bird Sanctuary, Haryana.jpg",maplink: "https://maps.app.goo.gl/qXqFCGiv87tjXryv5", description: 'Home to a variety of resident and migratory birds.', price: 50, imageSlug: 'sultanpur-bird-sanctuary-haryana', location: 'Gurugram, Haryana', coordinates: { lat: 28.4600, lng: 76.8900 }, state: "Haryana", theme: "Wildlife" },
  { id: 'hr3', name: 'Pinjore Gardens', image: "/PINJORE GARDENS.jpg",maplink: " https://maps.app.goo.gl/J3BnvS84HTX5inqGA", description: 'Mughal-style gardens, also known as Yadavindra Gardens.', price: 30, imageSlug: 'pinjore-gardens-haryana', location: 'Panchkula, Haryana', coordinates: { lat: 30.7920, lng: 76.9150 }, state: "Haryana", theme: "Historical" },
  { id: 'hr4', name: 'Morni Hills', image: "/Morni village Haryana.jpg", maplink: "https://maps.app.goo.gl/nWhdypiwGwUngNq26", description: 'Hill station offering scenic views, lakes, and adventure activities.', price: 100, imageSlug: 'morni-hills-haryana', location: 'Panchkula, Haryana', coordinates: { lat: 30.7000, lng: 77.0800 }, state: "Haryana", theme: "Nature" },
  // Himachal Pradesh
  { id: 'hp1', name: 'Shimla', image: "/Shimla, Himachal Pradesh.jpg",maplink: " https://maps.app.goo.gl/fDd8bDZuX4zzQkN4A", description: 'Popular hill station, former summer capital of British India.', price: 400, imageSlug: 'shimla-mall-road-himachal', location: 'Shimla, Himachal Pradesh', coordinates: { lat: 31.1048, lng: 77.1734 }, state: "Himachal Pradesh", theme: "Nature" },
  { id: 'hp2', name: 'Manali', image: "/Manali Himachal Pradesh India.jpg",maplink: "https://maps.app.goo.gl/zNDWabDSJg2ogtKdA", description: 'Famous for adventure sports, snow-capped mountains, and scenic beauty.', price: 500, imageSlug: 'manali-rohtang-pass-himachal', location: 'Kullu, Himachal Pradesh', coordinates: { lat: 32.2396, lng: 77.1887 }, state: "Himachal Pradesh", theme: "Adventure" },
  { id: 'hp3', name: 'Spiti Valley', image: "/Spiti Valley.jpg",maplink: "https://maps.app.goo.gl/ndEj2sjCFBnfyYEp8", description: 'Cold desert mountain valley known for its monasteries and stark landscapes.', price: 300, imageSlug: 'spiti-valley-monastery-himachal', location: 'Lahaul and Spiti, Himachal Pradesh', coordinates: { lat: 32.2400, lng: 78.0300 }, state: "Himachal Pradesh", theme: "Adventure" },
  { id: 'hp4', name: 'Dharamshala', image: "/Dharamshala__ himachal pradesh.jpg",maplink: "https://maps.app.goo.gl/SrBgUsUpE2Ck1S3g6", description: 'Home to the Dalai Lama and Tibetan government-in-exile, surrounded by cedar forests.', price: 250, imageSlug: 'dharamshala-mcleodganj-himachal', location: 'Kangra, Himachal Pradesh', coordinates: { lat: 32.2190, lng: 76.3234 }, state: "Himachal Pradesh", theme: "Pilgrimage" },
  // Jharkhand
  { id: 'jh1', name: 'Netarhat', image: "/Netarhat.jpg",maplink: "https://maps.app.goo.gl/XXFakuvqXizAYVvr7", description: 'Hill station known as the "Queen of Chotanagpur", famous for sunrise and sunset views.', price: 150, imageSlug: 'netarhat-sunrise-jharkhand', location: 'Latehar, Jharkhand', coordinates: { lat: 23.4800, lng: 84.2700 }, state: "Jharkhand", theme: "Nature" },
  { id: 'jh2', name: 'Hundru Falls', image: "/Hundru falls.jpg",maplink: "https://maps.app.goo.gl/Rg6fjR6Y12CGsizX6", description: 'One of the highest waterfalls in Jharkhand, created by the Subarnarekha River.', price: 50, imageSlug: 'hundru-falls-jharkhand', location: 'Ranchi, Jharkhand', coordinates: { lat: 23.4500, lng: 85.6500 }, state: "Jharkhand", theme: "Nature" },
  { id: 'jh3', name: 'Baidyanath Temple (Deoghar)', image: "/Deoghar.jpg", maplink: "https://maps.app.goo.gl/hgZjWZ3CY4H8sNch8", description: 'One of the twelve Jyotirlingas, a major pilgrimage site for Hindus.', price: 0, imageSlug: 'baidyanath-temple-deoghar-jharkhand', location: 'Deoghar, Jharkhand', coordinates: { lat: 24.4925, lng: 86.6970 }, state: "Jharkhand", theme: "Pilgrimage" },
  { id: 'jh4', name: 'Betla National Park', image: "/Betla National Park.jpg",maplink: "https://maps.app.goo.gl/Ym1MKVfZtSDGT7BPA", description: 'Rich in biodiversity, home to tigers, elephants, and various other wildlife.', price: 100, imageSlug: 'betla-national-park-jharkhand', location: 'Latehar, Jharkhand', coordinates: { lat: 23.8880, lng: 84.1900 }, state: "Jharkhand", theme: "Wildlife" },
  // Karnataka
  { id: 'ka1', name: 'Hampi', image: "/Hampi, Karnataka.jpg",maplink: "https://maps.app.goo.gl/eGesmHzp9ek9k1FXA", description: 'UNESCO site with ruins of the Vijayanagara Empire.', price: 150, imageSlug: 'hampi-ruins-karnataka', location: 'Bellary, Karnataka', coordinates: { lat: 15.3350, lng: 76.4600 }, state: "Karnataka", theme: "Historical" },
  { id: 'ka2', name: 'Mysore Palace', image: "/Mysore Palace, Karnataka Guide.jpg", maplink: "https://maps.app.goo.gl/s7CEyoihFjzkoUCt9", description: 'Grand historical palace, the official residence of the Wadiyar dynasty.', price: 100, imageSlug: 'mysore-palace-karnataka', location: 'Mysore, Karnataka', coordinates: { lat: 12.3051, lng: 76.6551 }, state: "Karnataka", theme: "Historical" },
  { id: 'ka3', name: 'Coorg (Kodagu)', image: "/Mallalli Falls, Coorg.jpg",maplink: "https://maps.app.goo.gl/o7ZX4Fji5w9VPEUg7", description: 'Hill station known for its coffee plantations, misty hills, and waterfalls.', price: 300, imageSlug: 'coorg-coffee-plantations-karnataka', location: 'Kodagu, Karnataka', coordinates: { lat: 12.3375, lng: 75.8069 }, state: "Karnataka", theme: "Nature" },
  { id: 'ka4', name: 'Gokarna', image: "/gokarana.jpg", maplink: "https://maps.app.goo.gl/GwNSRRMjf5G3uCCE7", description: 'Coastal town famous for its pristine beaches and Mahabaleshwar Temple.', price: 50, imageSlug: 'gokarna-beaches-karnataka', location: 'Uttara Kannada, Karnataka', coordinates: { lat: 14.5479, lng: 74.3188 }, state: "Karnataka", theme: "Beaches" },
  // Kerala
  { id: 'kl1', name: 'Munnar', image: "/Munnar, Kerala.jpg",maplink: "https://maps.app.goo.gl/C8kg6cSAUjFnXrpz6", description: 'Hill station with sprawling tea plantations and misty mountains.', price: 350, imageSlug: 'munnar-tea-gardens-kerala', location: 'Idukki, Kerala', coordinates: { lat: 10.0889, lng: 77.0595 }, state: "Kerala", theme: "Nature" },
  { id: 'kl2', name: 'Alleppey (Alappuzha) Backwaters', image: "/Allapuzha.jpg",maplink: "https://maps.app.goo.gl/AkrTApHU7JMVdLCG7", description: 'Famous for houseboat cruises through serene backwaters.', price: 600, imageSlug: 'alleppey-backwaters-houseboat-kerala', location: 'Alappuzha, Kerala', coordinates: { lat: 9.4981, lng: 76.3388 }, state: "Kerala", theme: "Nature" },
  { id: 'kl3', name: 'Kochi (Cochin)', image: "/Best Places to Visit in Kochi.jpg",maplink: "https://maps.app.goo.gl/sxpa5H8pZanc9JYZA", description: 'Port city with a rich history, known for Chinese fishing nets and colonial architecture.', price: 200, imageSlug: 'kochi-chinese-fishing-nets-kerala', location: 'Ernakulam, Kerala', coordinates: { lat: 9.9312, lng: 76.2673 }, state: "Kerala", theme: "Historical" },
  { id: 'kl4', name: 'Wayanad', image: "/Wayanad Wildlife Sanctuary.jpg",maplink: "https://maps.app.goo.gl/d4rBSWcTGwNtJdBx8", description: 'Green paradise with waterfalls, caves, wildlife sanctuaries, and spice plantations.', price: 250, imageSlug: 'wayanad-hills-kerala', location: 'Wayanad, Kerala', coordinates: { lat: 11.6854, lng: 76.1320 }, state: "Kerala", theme: "Nature" },
  // Madhya Pradesh
  { id: 'mp1', name: 'Khajuraho Temples', image: "/\Khajuraho Temple.jpg",maplink: "https://maps.app.goo.gl/UP8xBbize8AHqW5a8", description: 'UNESCO site famous for intricate sculptures and Nagara-style architecture.', price: 100, imageSlug: 'khajuraho-temples-madhya-pradesh', location: 'Chhatarpur, Madhya Pradesh', coordinates: { lat: 24.8319, lng: 79.9199 }, state: "Madhya Pradesh", theme: "Historical" },
  { id: 'mp2', name: 'Bandhavgarh National Park', image: "/Bandhavgarh National Park.jpg",maplink: "https://maps.app.goo.gl/Jx1cyjCRtctcutgG6", description: 'Known for its high density of Bengal tigers and diverse wildlife.', price: 300, imageSlug: 'bandhavgarh-tiger-madhya-pradesh', location: 'Umaria, Madhya Pradesh', coordinates: { lat: 23.7333, lng: 81.0333 }, state: "Madhya Pradesh", theme: "Wildlife" },
  { id: 'mp3', name: 'Sanchi Stupa', image: "/Stupa.jpg",maplink: "https://maps.app.goo.gl/iVMoLk9JqbK5BdVD8", description: 'Great Buddhist stupa, a UNESCO World Heritage site.', price: 50, imageSlug: 'sanchi-stupa-madhya-pradesh', location: 'Raisen, Madhya Pradesh', coordinates: { lat: 23.4880, lng: 77.7398 }, state: "Madhya Pradesh", theme: "Historical" },
  { id: 'mp4', name: 'Pachmarhi', image: "/Pachmarhi, India.jpg",maplink: "https://maps.app.goo.gl/LwSa3AnuEA8BcPz29", description: 'Hill station known as "Satpura ki Rani", with waterfalls, caves, and forests.', price: 200, imageSlug: 'pachmarhi-hills-madhya-pradesh', location: 'Hoshangabad, Madhya Pradesh', coordinates: { lat: 22.4667, lng: 78.4333 }, state: "Madhya Pradesh", theme: "Nature" },
  // Maharashtra
  { id: 'mh1', name: 'Ajanta & Ellora Caves', image: "/Ajanta Caves, Maharashtra.jpg",maplink: "https://maps.app.goo.gl/QM2JMmgq1RGNGTTHA", description: 'UNESCO sites with rock-cut caves showcasing Buddhist, Hindu, and Jain art.', price: 200, imageSlug: 'ajanta-ellora-caves-maharashtra', location: 'Aurangabad, Maharashtra', coordinates: { lat: 20.5525, lng: 75.7033 }, state: "Maharashtra", theme: "Historical" },
  { id: 'mh2', name: 'Mumbai Gateway of India', image: "/Gateway of India, Mumbai.jpg",maplink: "https://maps.app.goo.gl/uoQ7ufgjeWhqEVfZ7", description: 'Iconic arch-monument overlooking the Arabian Sea.', price: 0, imageSlug: 'gateway-of-india-mumbai-maharashtra', location: 'Mumbai, Maharashtra', coordinates: { lat: 18.9220, lng: 72.8347 }, state: "Maharashtra", theme: "Historical" },
  { id: 'mh3', name: 'Mahabaleshwar', image: "/Pratapgarh Fort,  Maharastra.jpg",maplink: "https://maps.app.goo.gl/kTfaoFjwfcm8D5Ru7", description: 'Popular hill station known for its strawberry farms, viewpoints, and pleasant climate.', price: 250, imageSlug: 'mahabaleshwar-hills-maharashtra', location: 'Satara, Maharashtra', coordinates: { lat: 17.9230, lng: 73.6580 }, state: "Maharashtra", theme: "Nature" },
  { id: 'mh4', name: 'Shirdi', image: "/shirdi.jpg",maplink: "https://maps.app.goo.gl/QC9NBEMsE7iFDTsNA", description: 'Major pilgrimage site, home to the shrine of Sai Baba.', price: 0, imageSlug: 'shirdi-sai-baba-temple-maharashtra', location: 'Ahmednagar, Maharashtra', coordinates: { lat: 19.7645, lng: 74.4766 }, state: "Maharashtra", theme: "Pilgrimage" },
  // Manipur
  { id: 'mn1', name: 'Loktak Lake', image: "/Loktak Lake.jpg",maplink: "https://maps.app.goo.gl/2qZfHEXMbbML2tCV8", description: 'Largest freshwater lake in Northeast India, famous for its floating phumdis.', price: 100, imageSlug: 'loktak-lake-manipur', location: 'Bishnupur, Manipur', coordinates: { lat: 24.5000, lng: 93.7833 }, state: "Manipur", theme: "Nature" },
  { id: 'mn2', name: 'Kangla Fort', image: "/Kangla Fort.jpg",maplink: "https://maps.app.goo.gl/wC3KAPorZsbGveYb8", description: 'Historic fort, the ancient capital of Manipur.', price: 30, imageSlug: 'kangla-fort-manipur', location: 'Imphal, Manipur', coordinates: { lat: 24.8060, lng: 93.9360 }, state: "Manipur", theme: "Historical" },
  { id: 'mn3', name: 'Sendra Island', image: "/Sendra island.jpg",maplink: "https://maps.app.goo.gl/azhFQe3UYj7EfTps7", description: 'Island on Loktak Lake offering panoramic views and boating facilities.', price: 50, imageSlug: 'sendra-island-loktak-manipur', location: 'Bishnupur, Manipur', coordinates: { lat: 24.5000, lng: 93.7833 }, state: "Manipur", theme: "Nature" },
  { id: 'mn4', name: 'Keibul Lamjao National Park', image: "/Keibul Lamjao National Park.jpg",maplink: "https://maps.app.goo.gl/e4FNCLYfoTpdGVvV7", description: 'The only floating park in the world, home to the endangered Sangai deer.', price: 150, imageSlug: 'keibul-lamjao-park-manipur', location: 'Bishnupur, Manipur', coordinates: { lat: 24.4833, lng: 93.7667 }, state: "Manipur", theme: "Wildlife" },
  // Meghalaya
  { id: 'ml1', name: 'Cherrapunji (Sohra)', image: "/Cherrapunji.jpg",maplink: "https://maps.app.goo.gl/Wc8XVuiWm6ZQ88XH9", description: 'Known for its heavy rainfall, living root bridges, and stunning waterfalls.', price: 100, imageSlug: 'cherrapunji-waterfalls-meghalaya', location: 'East Khasi Hills, Meghalaya', coordinates: { lat: 25.2700, lng: 91.7300 }, state: "Meghalaya", theme: "Nature" },
  { id: 'ml2', name: 'Living Root Bridges', image: "/Living Root Bridges.jpg",maplink: "https://maps.app.goo.gl/1ppksTyE6UAuDXat9", description: 'Unique bridges handmade by Khasi tribes from living tree roots.', price: 0, imageSlug: 'living-root-bridges-meghalaya', location: 'Various locations, Meghalaya', coordinates: { lat: 25.2700, lng: 91.7300 }, state: "Meghalaya", theme: "Nature" },
  { id: 'ml3', name: 'Dawki River (Umngot)', image: "/Dawki River.jpg",maplink: "https://maps.app.goo.gl/tM9EBSJD77kGMB3AA", description: 'Famous for its crystal clear waters, offering boating and stunning views.', price: 200, imageSlug: 'dawki-river-meghalaya', location: 'West Jaintia Hills, Meghalaya', coordinates: { lat: 25.1833, lng: 92.0167 }, state: "Meghalaya", theme: "Nature" },
  { id: 'ml4', name: 'Shillong', image: "/shillong.jpg",maplink: "https://maps.app.goo.gl/C9UWHwWeJiG72Hsw9", description: 'Capital city, known as the "Scotland of the East" for its beautiful landscapes.', price: 150, imageSlug: 'shillong-cityscape-meghalaya', location: 'East Khasi Hills, Meghalaya', coordinates: { lat: 25.5788, lng: 91.8933 }, state: "Meghalaya", theme: "Nature" },
  // Mizoram
  { id: 'mz1', name: 'Aizawl', image: "/Aizawl, Mizoram.jpg",maplink: "https://maps.app.goo.gl/c1TafYarEqFMfMV56", description: 'Capital city, perched on ridges, offering panoramic views of hills and valleys.', price: 100, imageSlug: 'aizawl-city-mizoram', location: 'Aizawl, Mizoram', coordinates: { lat: 23.7271, lng: 92.7176 }, state: "Mizoram", theme: "Nature" },
  { id: 'mz2', name: 'Vantawng Falls', image: "/Vantawng Falls.jpg",maplink: "https://maps.app.goo.gl/2YGxyqhrzC2CJmRA8", description: 'Highest waterfall in Mizoram, surrounded by lush greenery.', price: 50, imageSlug: 'vantawng-falls-mizoram', location: 'Serchhip, Mizoram', coordinates: { lat: 23.3833, lng: 92.8333 }, state: "Mizoram", theme: "Nature" },
  { id: 'mz3', name: 'Phawngpui Hills (Blue Mountain)', image: "/Phawngpui Hills.jpg",maplink: "https://maps.app.goo.gl/wNys6ncmEBZvCJ6X9", description: 'Highest peak in Mizoram, a biodiversity hotspot with orchids and rhododendrons.', price: 150, imageSlug: 'phawngpui-hills-mizoram', location: 'Lawngtlai, Mizoram', coordinates: { lat: 22.6333, lng: 93.0500 }, state: "Mizoram", theme: "Nature" },
  { id: 'mz4', name: 'Tam Dil Lake', image: "/Tam Dil Lake.jpg", maplink: "https://maps.app.goo.gl/Fi6CuYMy6XvSVzyL7", description: 'Picturesque man-made lake, ideal for boating and picnics.', price: 30, imageSlug: 'tam-dil-lake-mizoram', location: 'Aizawl, Mizoram', coordinates: { lat: 23.7500, lng: 92.9167 }, state: "Mizoram", theme: "Nature" },
  // Nagaland
  { id: 'nl1', name: 'Kohima', image: "/Part of Kohima.jpg",maplink: "https://maps.app.goo.gl/xQauGhB5nSTT9y3J8", description: 'Capital city, known for its World War II cemetery and vibrant Hornbill Festival.', price: 100, imageSlug: 'kohima-war-cemetery-nagaland', location: 'Kohima, Nagaland', coordinates: { lat: 25.6751, lng: 94.1053 }, state: "Nagaland", theme: "Historical" },
  { id: 'nl2', name: 'Dzukou Valley', image: "/Dzukou Valley.jpg",maplink: "https://maps.app.goo.gl/bowihQ2qVpMZFP5D6", description: 'Valley of flowers, famous for trekking and seasonal blooms.', price: 200, imageSlug: 'dzukou-valley-nagaland', location: 'Kohima, Nagaland', coordinates: { lat: 25.5500, lng: 94.0833 }, state: "Nagaland", theme: "Adventure" },
  { id: 'nl3', name: 'Hornbill Festival', image: "/Hornbill Festival.jpg",maplink: "https://maps.app.goo.gl/nYw9b7WPuRVUJAwu9", description: 'Annual festival showcasing the rich culture and traditions of Naga tribes.', price: 500, imageSlug: 'hornbill-festival-nagaland', location: 'Kisama, Nagaland', coordinates: { lat: 25.6000, lng: 94.0500 }, state: "Nagaland", theme: "Culture" },
  { id: 'nl4', name: 'Mokokchung', image: "/mokokchung.jpg",maplink: "https://maps.app.goo.gl/4NdT5EDNBtP1Wiwn6", description: 'Cultural hub of the Ao Naga tribe, known for its scenic beauty and traditions.', price: 150, imageSlug: 'mokokchung-village-nagaland', location: 'Mokokchung, Nagaland', coordinates: { lat: 26.3300, lng: 94.5300 }, state: "Nagaland", theme: "Culture" },
  // Odisha
  { id: 'od1', name: 'Puri Jagannath Temple', image: "/Puri Jagannath Temple.jpg",maplink: "https://maps.app.goo.gl/NfMjNiVY2TWQVPt87", description: 'Famous Hindu temple dedicated to Lord Jagannath, part of Char Dham pilgrimages.', price: 0, imageSlug: 'jagannath-temple-puri-odisha', location: 'Puri, Odisha', coordinates: { lat: 19.8049, lng: 85.8183 }, state: "Odisha", theme: "Pilgrimage" },
  { id: 'od2', name: 'Konark Sun Temple', image: "/Konark Sun Temple.jpg",maplink: "https://maps.app.goo.gl/YPfQKaAWxNNkCP4h8",description: 'UNESCO site, a 13th-century temple shaped like a giant chariot.', price: 50, imageSlug: 'konark-sun-temple-odisha', location: 'Konark, Odisha', coordinates: { lat: 19.8876, lng: 86.0945 }, state: "Odisha", theme: "Historical" },
  { id: 'od3', name: 'Chilika Lake', image: "/chilla lake.jpg",maplink: "https://maps.app.goo.gl/atLPBTeh52796cANA", description: 'Asia\'s largest brackish water lagoon, a haven for migratory birds.', price: 100, imageSlug: 'chilika-lake-dolphins-odisha', location: 'Puri/Ganjam/Khordha, Odisha', coordinates: { lat: 19.7333, lng: 85.3333 }, state: "Odisha", theme: "Nature" },
  { id: 'od4', name: 'Bhitarkanika National Park', image: "/Bhitarkanika National Park.jpg",maplink: "https://maps.app.goo.gl/zPPomWEZAjeNXrcj7", description: 'Known for its mangrove forests, saltwater crocodiles, and diverse birdlife.', price: 150, imageSlug: 'bhitarkanika-crocodiles-odisha', location: 'Kendrapara, Odisha', coordinates: { lat: 20.6333, lng: 86.9000 }, state: "Odisha", theme: "Wildlife" },
  // Punjab
  { id: 'pb1', name: 'Golden Temple (Amritsar)', image: "/Sri Darbar Sahib, Amritsar.jpg",maplink: "https://maps.app.goo.gl/3CESGDSXGDyjbFcF8", description: 'The holiest shrine for Sikhs, known for its stunning golden dome and langar.', price: 0, imageSlug: 'golden-temple-amritsar-punjab', location: 'Amritsar, Punjab', coordinates: { lat: 31.6200, lng: 74.8765 }, state: "Punjab", theme: "Pilgrimage" },
  { id: 'pb2', name: 'Jallianwala Bagh', image: "/jallianwala bagh.jpg",maplink: "https://maps.app.goo.gl/aPP1aiGMM5VE53KVA", description: 'Historic garden and memorial of national importance, site of the 1919 massacre.', price: 0, imageSlug: 'jallianwala-bagh-amritsar-punjab', location: 'Amritsar, Punjab', coordinates: { lat: 31.6209, lng: 74.8800 }, state: "Punjab", theme: "Historical" },
  { id: 'pb3', name: 'Wagah Border', image: "/Wagah Border, India.jpg",maplink: "https://maps.app.goo.gl/mxwSdihcg8K52UDi9", description: 'India-Pakistan border crossing with a daily flag-lowering ceremony.', price: 0, imageSlug: 'wagah-border-ceremony-punjab', location: 'Amritsar, Punjab', coordinates: { lat: 31.6050, lng: 74.5760 }, state: "Punjab", theme: "Culture" },
  { id: 'pb4', name: 'Anandpur Sahib', image: "/Anandpur Sahib - tourmet.jpg",maplink: "https://maps.app.goo.gl/udXnSUam8UjnSJe48", description: 'Important Sikh pilgrimage site, birthplace of the Khalsa.', price: 0, imageSlug: 'anandpur-sahib-gurudwara-punjab', location: 'Rupnagar, Punjab', coordinates: { lat: 31.2300, lng: 76.5000 }, state: "Punjab", theme: "Pilgrimage" },
  // Rajasthan
  { id: 'rj1', name: 'Jaipur (Amber Fort)', image: "/amber fort.jpg",maplink: "https://maps.app.goo.gl/DAAxvyZ4NydZCxud8", description: 'The Pink City, known for majestic forts, palaces, and vibrant markets.', price: 250, imageSlug: 'jaipur-amber-fort-rajasthan', location: 'Jaipur, Rajasthan', coordinates: { lat: 26.9850, lng: 75.8513 }, state: "Rajasthan", theme: "Historical" },
  { id: 'rj2', name: 'Udaipur', image: "/City Palace of Udaipur.jpg",maplink: "https://maps.app.goo.gl/2FyPvwfb2R5vsV8a7", description: 'City of Lakes, famous for its romantic palaces, lakes, and gardens.', price: 450, imageSlug: 'udaipur-lake-palace-rajasthan', location: 'Udaipur, Rajasthan', coordinates: { lat: 24.5854, lng: 73.7125 }, state: "Rajasthan", theme: "Historical" },
  { id: 'rj3', name: 'Jaisalmer', image: "/Jaisalmer Fort.jpg",maplink: "https://maps.app.goo.gl/BqGS3DgZQyDqTG5HA", description: 'The Golden City, known for its magnificent fort, desert safaris, and havelis.', price: 300, imageSlug: 'jaisalmer-fort-desert-rajasthan', location: 'Jaisalmer, Rajasthan', coordinates: { lat: 26.9157, lng: 70.9083 }, state: "Rajasthan", theme: "Historical" },
  { id: 'rj4', name: 'Mount Abu', image: "/mount Abu,.jpg",maplink: "https://maps.app.goo.gl/uT8ALF2KnuaprSF88", description: 'Only hill station in Rajasthan, known for Dilwara Temples and Nakki Lake.', price: 200, imageSlug: 'mount-abu-dilwara-temples-rajasthan', location: 'Sirohi, Rajasthan', coordinates: { lat: 24.5926, lng: 72.7156 }, state: "Rajasthan", theme: "Nature" },
  // Sikkim
  { id: 'sk1', name: 'Gangtok', image: "/Beauty of Gangtok.jpg",maplink: "https://maps.app.goo.gl/jQWduu9i1fEejM4a8", description: 'Capital city offering stunning views of Kanchenjunga, monasteries, and vibrant culture.', price: 300, imageSlug: 'gangtok-cityscape-sikkim', location: 'East Sikkim, Sikkim', coordinates: { lat: 27.3389, lng: 88.6065 }, state: "Sikkim", theme: "Nature" },
  { id: 'sk2', name: 'Tsomgo Lake (Changu Lake)', image: "/Tsomgo or Changu lake .jpg",maplink: "https://maps.app.goo.gl/QVVVBiTiKFGrRBJu7", description: 'Glacial lake at high altitude, known for its scenic beauty and changing colors.', price: 100, imageSlug: 'tsomgo-lake-sikkim', location: 'East Sikkim, Sikkim', coordinates: { lat: 27.3747, lng: 88.7600 }, state: "Sikkim", theme: "Nature" },
  { id: 'sk3', name: 'Nathula Pass', image: "/Nathula.jpg",maplink: "https://maps.app.goo.gl/cqKZqmj6nMZFH2uq7", description: 'Mountain pass on the Indo-China border, offering breathtaking views.', price: 150, imageSlug: 'nathula-pass-sikkim', location: 'East Sikkim, Sikkim', coordinates: { lat: 27.3861, lng: 88.8300 }, state: "Sikkim", theme: "Adventure" },
  { id: 'sk4', name: 'Yumthang Valley', image: "/Yumthang Valley.jpg",maplink: "https://maps.app.goo.gl/R9AReqh3ZSxX7pWd7", description: 'Valley of Flowers, known for its hot springs, meadows, and rhododendrons.', price: 200, imageSlug: 'yumthang-valley-sikkim', location: 'North Sikkim, Sikkim', coordinates: { lat: 27.8300, lng: 88.6900 }, state: "Sikkim", theme: "Nature" },
  // Tamil Nadu
  { id: 'tn1', name: 'Meenakshi Temple (Madurai)', image: "/meenakshi temple.jpg",maplink: "https://maps.app.goo.gl/NWejqqvm6YTynLHh6", description: 'Historic Hindu temple with towering gopurams and intricate carvings.', price: 50, imageSlug: 'meenakshi-temple-madurai-tamilnadu', location: 'Madurai, Tamil Nadu', coordinates: { lat: 9.9195, lng: 78.1196 }, state: "Tamil Nadu", theme: "Pilgrimage" },
  { id: 'tn2', name: 'Mahabalipuram', image: "/Mahabalipuram.jpg",maplink: "https://maps.app.goo.gl/sh1zdBRyicp72SUa9", description: 'UNESCO site with rock-cut temples, shore temple, and rathas.', price: 100, imageSlug: 'mahabalipuram-shore-temple-tamilnadu', location: 'Kanchipuram, Tamil Nadu', coordinates: { lat: 12.6270, lng: 80.1930 }, state: "Tamil Nadu", theme: "Historical" },
  { id: 'tn3', name: 'Ooty (Udagamandalam)', image: "/How to reach Ooty, The Nilgiris.jpg",maplink: "https://maps.app.goo.gl/6Rfd26Ykb7sKkh3X7", description: 'Popular hill station known for its tea gardens, botanical gardens, and toy train.', price: 250, imageSlug: 'ooty-tea-gardens-tamilnadu', location: 'Nilgiris, Tamil Nadu', coordinates: { lat: 11.4100, lng: 76.6950 }, state: "Tamil Nadu", theme: "Nature" },
  { id: 'tn4', name: 'Kanyakumari', image: "/Kanyakumari.jpg",maplink: "https://maps.app.goo.gl/fQJC13UbdbbmxAbg7", description: 'Southernmost tip of India, famous for Vivekananda Rock Memorial and Thiruvalluvar Statue.', price: 0, imageSlug: 'kanyakumari-vivekananda-rock-tamilnadu', location: 'Kanyakumari, Tamil Nadu', coordinates: { lat: 8.0883, lng: 77.5385 }, state: "Tamil Nadu", theme: "Pilgrimage" },
  { id: 'tn5', name: 'thiruchendur', image: "/Thiruchendur Murugan Temple.jpg",maplink: "https://maps.app.goo.gl/E5hGHHTLKJjSeNEH6", description: 'most beautiful place.', price: 0, imageSlug: 'murugar kovil tamilnadu', location: 'thiruchendur, Tamil Nadu', coordinates: { lat: 8.0883, lng: 77.5385 }, state: "Tamil Nadu", theme: "Pilgrimage" },
  // Telangana
  { id: 'tg1', name: 'Charminar', image: "/charminar.jpg",maplink: "https://maps.app.goo.gl/v4gWbZG1F8GVKJs18", description: 'Iconic monument and mosque in Hyderabad, a symbol of the city.', price: 20, imageSlug: 'charminar-hyderabad-telangana', location: 'Hyderabad, Telangana', coordinates: { lat: 17.3616, lng: 78.4747 }, state: "Telangana", theme: "Historical" },
  { id: 'tg2', name: 'Ramoji Film City', image: "/Ramoji Film City.jpg",maplink: "https://maps.app.goo.gl/XEMCEvJhDaVX3YZc9", description: 'World\'s largest integrated film city and popular tourist attraction.', price: 1200, imageSlug: 'ramoji-film-city-hyderabad-telangana', location: 'Hyderabad, Telangana', coordinates: { lat: 17.2543, lng: 78.6800 }, state: "Telangana", theme: "Entertainment" },
  { id: 'tg3', name: 'Golconda Fort', image: "/Golconda Fort.jpg",maplink: "https://maps.app.goo.gl/LZd5RAnm1Voj7LXR9", description: 'Historic fort known for its acoustics, palaces, and diamond trade history.', price: 50, imageSlug: 'golconda-fort-hyderabad-telangana', location: 'Hyderabad, Telangana', coordinates: { lat: 17.3833, lng: 78.4011 }, state: "Telangana", theme: "Historical" },
  { id: 'tg4', name: 'Warangal Fort', image: "/Warangal Fort.jpg",maplink: "https://maps.app.goo.gl/ysxvU4pLmH5HyP2f7", description: '13th-century fort showcasing Kakatiya architecture and intricate carvings.', price: 30, imageSlug: 'warangal-fort-telangana', location: 'Warangal, Telangana', coordinates: { lat: 17.9689, lng: 79.5950 }, state: "Telangana", theme: "Historical" },
  // Tripura
  { id: 'tr1', name: 'Ujjayanta Palace', image: "/Ujjayanta Palace.jpg",maplink: "https://maps.app.goo.gl/QGBSsRpGa9cc2HwV7", description: 'Former royal palace, now a state museum, showcasing Tripura\'s history and culture.', price: 30, imageSlug: 'ujjayanta-palace-agartala-tripura', location: 'Agartala, Tripura', coordinates: { lat: 23.8315, lng: 91.2796 }, state: "Tripura", theme: "Historical" },
  { id: 'tr2', name: 'Neermahal', image: "/Neermahal.jpg",maplink: "https://maps.app.goo.gl/km3UmsWdA8r1gpST9", description: 'Water palace built in the middle of Rudrasagar Lake, a blend of Hindu and Mughal architecture.', price: 50, imageSlug: 'neermahal-water-palace-tripura', location: 'Melaghar, Tripura', coordinates: { lat: 23.4833, lng: 91.3333 }, state: "Tripura", theme: "Historical" },
  { id: 'tr3', name: 'Jampui Hills', image: "/Jampui Hills.jpg",maplink: "https://maps.app.goo.gl/5HZsPtnaYsgSQcyF9", description: 'Hill range known for its orange orchards, pleasant climate, and scenic beauty.', price: 100, imageSlug: 'jampui-hills-tripura', location: 'North Tripura, Tripura', coordinates: { lat: 23.9500, lng: 92.2833 }, state: "Tripura", theme: "Nature" },
  { id: 'tr4', name: 'Tripura Sundari Temple (Matabari)', image: "/Tripura Sundari Temple .jpg",maplink: "https://maps.app.goo.gl/TUYARdhiG9rhPcvk6", description: 'One of the 51 Shakti Peethas, an important Hindu pilgrimage site.', price: 0, imageSlug: 'tripura-sundari-temple-tripura', location: 'Udaipur, Tripura', coordinates: { lat: 23.5333, lng: 91.4833 }, state: "Tripura", theme: "Pilgrimage" },
  // Uttar Pradesh
  { id: 'up1', name: 'Taj Mahal', image: "/Taj Mahal.jpg",maplink: "https://maps.app.goo.gl/4AR7Eu5hUp1jQSdR8", description: 'Ivory-white marble mausoleum, a symbol of eternal love and UNESCO site.', price: 1300, imageSlug: 'taj-mahal-agra-uttar-pradesh', location: 'Agra, Uttar Pradesh', coordinates: { lat: 27.1751, lng: 78.0421 }, state: "Uttar Pradesh", theme: "Historical" },
  { id: 'up2', name: 'Varanasi Ghats', image: "/Banaras Ghat, Varanasi.jpg",maplink: "https://maps.app.goo.gl/7FSxaUACp2qir4cM9", description: 'Riverfront steps along the Ganges, central to Hindu rituals and spirituality.', price: 0, imageSlug: 'varanasi-ghats-ganges-uttar-pradesh', location: 'Varanasi, Uttar Pradesh', coordinates: { lat: 25.3176, lng: 82.9739 }, state: "Uttar Pradesh", theme: "Pilgrimage" },
  { id: 'up3', name: 'Fatehpur Sikri', image: "/The Fatehpur Sikri,.jpg",maplink: "https://maps.app.goo.gl/69xsbU9vbFvKF3aR7", description: 'UNESCO site, a deserted Mughal city with well-preserved palaces and mosques.', price: 60, imageSlug: 'fatehpur-sikri-uttar-pradesh', location: 'Agra, Uttar Pradesh', coordinates: { lat: 27.0947, lng: 77.6647 }, state: "Uttar Pradesh", theme: "Historical" },
  { id: 'up4', name: 'Mathura Vrindavan', image: "/prem mandir mathura.jpg",maplink: "https://maps.app.goo.gl/T89T2HxeuATP1kQe6", description: 'Twin holy cities associated with Lord Krishna, major pilgrimage destinations.', price: 0, imageSlug: 'mathura-vrindavan-temples-uttar-pradesh', location: 'Mathura, Uttar Pradesh', coordinates: { lat: 27.4924, lng: 77.6776 }, state: "Uttar Pradesh", theme: "Pilgrimage" },
  // Uttarakhand
  { id: 'uk1', name: 'Rishikesh', image: "/Rishikesh .jpg",maplink: "https://maps.app.goo.gl/1xg5KxjoDwqCoHx47", description: 'Yoga Capital of the World, known for ashrams, adventure sports, and the Ganges.', price: 300, imageSlug: 'rishikesh-ganges-yoga-uttarakhand', location: 'Dehradun, Uttarakhand', coordinates: { lat: 30.0869, lng: 78.2676 }, state: "Uttarakhand", theme: "Adventure" },
  { id: 'uk2', name: 'Kedarnath', image: "/Kedarnath Dham Yatra 2025.jpg",maplink: "https://maps.app.goo.gl/bjpNJnK7jRZPymgY6", description: 'One of the Char Dhams, a revered Hindu shrine dedicated to Lord Shiva.', price: 0, imageSlug: 'kedarnath-temple-himalayas-uttarakhand', location: 'Rudraprayag, Uttarakhand', coordinates: { lat: 30.7352, lng: 79.0669 }, state: "Uttarakhand", theme: "Pilgrimage" },
  { id: 'uk3', name: 'Valley of Flowers', image: "/Valley of Flowers .jpg",maplink: "https://maps.app.goo.gl/RWLjr9U6brjy9mLk6", description: 'UNESCO site, a national park known for its meadows of endemic alpine flowers.', price: 150, imageSlug: 'valley-of-flowers-uttarakhand', location: 'Chamoli, Uttarakhand', coordinates: { lat: 30.7289, lng: 79.6053 }, state: "Uttarakhand", theme: "Nature" },
  { id: 'uk4', name: 'Nainital', image: "/Nainital.jpg",maplink: "https://maps.app.goo.gl/wsrxQGzC9gj7ZrkP9", description: 'Popular hill station built around a mango-shaped lake, surrounded by mountains.', price: 200, imageSlug: 'nainital-lake-uttarakhand', location: 'Nainital, Uttarakhand', coordinates: { lat: 29.3919, lng: 79.4542 }, state: "Uttarakhand", theme: "Nature" },
  // West Bengal
  { id: 'wb1', name: 'Sundarbans National Park', image: "/Sundarbans National Park - India.jpg",maplink: "https://maps.app.goo.gl/594L2MxG2P6B9TeQ8", description: 'World\'s largest mangrove forest, home to the Bengal tiger and diverse wildlife.', price: 300, imageSlug: 'sundarbans-mangrove-tiger-west-bengal', location: 'South 24 Parganas, West Bengal', coordinates: { lat: 21.9497, lng: 89.1833 }, state: "West Bengal", theme: "Wildlife" },
  { id: 'wb2', name: 'Darjeeling', image: "/Darjeeling .jpg",maplink: "https://maps.app.goo.gl/JeQfcBQJe2gkXFHg6", description: 'Hill station famous for its tea plantations, toy train, and views of Kanchenjunga.', price: 250, imageSlug: 'darjeeling-tea-gardens-west-bengal', location: 'Darjeeling, West Bengal', coordinates: { lat: 27.0410, lng: 88.2663 }, state: "West Bengal", theme: "Nature" },
  { id: 'wb3', name: 'Victoria Memorial', image: "/Victoria Memorial, Kolkata.jpg",maplink: "https://maps.app.goo.gl/qV4MntLr1WrfYzUp8", description: 'Grand marble building in Kolkata, a museum dedicated to Queen Victoria.', price: 30, imageSlug: 'victoria-memorial-kolkata-west-bengal', location: 'Kolkata, West Bengal', coordinates: { lat: 22.5448, lng: 88.3426 }, state: "West Bengal", theme: "Historical" },
  { id: 'wb4', name: 'Kalimpong', image: "/the Kalimpong.jpg",maplink: "https://maps.app.goo.gl/xvV5TiHJRt7HvThi7", description: 'Hill station offering panoramic views, Buddhist monasteries, and colonial architecture.', price: 150, imageSlug: 'kalimpong-hills-west-bengal', location: 'Kalimpong, West Bengal', coordinates: { lat: 27.0600, lng: 88.4700 }, state: "West Bengal", theme: "Nature" },
  // Delhi (UT)
  { id: 'dl1', name: 'India Gate', image: "/India gate.jpg",maplink: "https://maps.app.goo.gl/uSwgg8m7Wi2i9HbY8", description: 'War memorial arch, a prominent landmark in New Delhi.', price: 0, imageSlug: 'india-gate-delhi', location: 'New Delhi, Delhi', coordinates: { lat: 28.6129, lng: 77.2295 }, state: "Delhi", theme: "Historical" },
  { id: 'dl2', name: 'Qutub Minar', image: "/Premium Photo _ Qutub Minar.jpg",maplink: "https://maps.app.goo.gl/LmpYwhi6VeBfxVB59", description: 'UNESCO site, a towering minaret made of red sandstone and marble.', price: 40, imageSlug: 'qutub-minar-delhi', location: 'New Delhi, Delhi', coordinates: { lat: 28.5245, lng: 77.1855 }, state: "Delhi", theme: "Historical" },
  { id: 'dl3', name: 'Red Fort (Lal Qila)', image: "/Lal Qila or Red Fort Delhi India - Travelure .jpg",maplink: "https://maps.app.goo.gl/iyTBs2fJpP1epz8W7", description: 'Historic fort that served as the main residence of Mughal emperors.', price: 35, imageSlug: 'red-fort-delhi', location: 'Old Delhi, Delhi', coordinates: { lat: 28.6562, lng: 77.2410 }, state: "Delhi", theme: "Historical" },
  { id: 'dl4', name: 'Akshardham Temple', image: "/Akshardham temple, at Delhi_.jpg",maplink: "https://maps.app.goo.gl/E44rFKkHTRBAdHis5", description: 'Sprawling Hindu temple complex showcasing Indian art, culture, and spirituality.', price: 0, imageSlug: 'akshardham-temple-delhi', location: 'New Delhi, Delhi', coordinates: { lat: 28.6127, lng: 77.2773 }, state: "Delhi", theme: "Pilgrimage" },
  // Puducherry (UT)
  { id: 'py1', name: 'Auroville', image: "/Auroville.jpg",maplink: "https://maps.app.goo.gl/xy797Bt1FfnJWwBk6", description: 'Experimental township dedicated to human unity and sustainable living.', price: 0, imageSlug: 'auroville-matrimandir-puducherry', location: 'Viluppuram, Puducherry', coordinates: { lat: 12.0069, lng: 79.8107 }, state: "Puducherry", theme: "Spiritual" },
  { id: 'py2', name: 'Paradise Beach', image: "/the Rock Beach, Pondicherry.jpg",maplink: "https://maps.app.goo.gl/swV4FvucFWQc3gX48", description: 'Pristine beach accessible by boat, known for its golden sands and clear waters.', price: 150, imageSlug: 'paradise-beach-puducherry', location: 'Puducherry', coordinates: { lat: 11.8600, lng: 79.8000 }, state: "Puducherry", theme: "Beaches" },
  { id: 'py3', name: 'French Quarter (White Town)', image: "/white town(french quarter).jpg",maplink: "https://maps.app.goo.gl/rJbnyrR4dqb7fTWs7", description: 'Colonial-era streets with French architecture, boutiques, and cafes.', price: 0, imageSlug: 'french-quarter-puducherry', location: 'Puducherry', coordinates: { lat: 11.9320, lng: 79.8330 }, state: "Puducherry", theme: "Historical" },
  { id: 'py4', name: 'Promenade Beach', image: "/promenade beach.jpg",maplink: "https://maps.app.goo.gl/sjT8ygHWCwYdcLFN6", description: 'Popular beachfront stretch for walks, with landmarks like the War Memorial.', price: 0, imageSlug: 'promenade-beach-puducherry', location: 'Puducherry', coordinates: { lat: 11.9300, lng: 79.8350 }, state: "Puducherry", theme: "Beaches" },
  // Jammu & Kashmir (UT)
  { id: 'jk1', name: 'Srinagar (Dal Lake)', image: "Dal Lake.jpg",maplink: "https://maps.app.goo.gl/6ksTavY82Bh5ibYr8", description: 'Summer capital known for Dal Lake, houseboats, Mughal gardens, and scenic beauty.', price: 200, imageSlug: 'dal-lake-srinagar-kashmir', location: 'Srinagar, Jammu & Kashmir', coordinates: { lat: 34.0837, lng: 74.7973 }, state: "Jammu & Kashmir", theme: "Nature" },
  { id: 'jk2', name: 'Gulmarg', image: "/Gulmarg.jpg",maplink: "https://maps.app.goo.gl/bg4NayanevYiMgC47", description: 'Popular skiing destination with stunning meadows and the Gulmarg Gondola.', price: 500, imageSlug: 'gulmarg-skiing-kashmir', location: 'Baramulla, Jammu & Kashmir', coordinates: { lat: 34.0485, lng: 74.3805 }, state: "Jammu & Kashmir", theme: "Adventure" },
  { id: 'jk3', name: 'Pahalgam', image: "/Pahalgam.jpg",maplink: "https://maps.app.goo.gl/1HGBRpFasW3hUqoLA", description: 'Picturesque town on the banks of Lidder River, base for Amarnath Yatra.', price: 300, imageSlug: 'pahalgam-valley-kashmir', location: 'Anantnag, Jammu & Kashmir', coordinates: { lat: 34.0100, lng: 75.3200 }, state: "Jammu & Kashmir", theme: "Nature" },
  { id: 'jk4', name: 'Vaishno Devi', image: "/Mata Vaisno Devi.jpg",maplink: "https://maps.app.goo.gl/iTPFiZrU34rKYh2v9", description: 'Major Hindu pilgrimage site dedicated to Goddess Vaishno Devi, located in Trikuta Mountains.', price: 0, imageSlug: 'vaishno-devi-temple-kashmir', location: 'Katra, Jammu & Kashmir', coordinates: { lat: 33.0300, lng: 74.9500 }, state: "Jammu & Kashmir", theme: "Pilgrimage" },
  // Ladakh (UT)
  { id: 'la1', name: 'Pangong Lake', image: "/Pangong lake, Ladakh.jpg",maplink: "https://maps.app.goo.gl/NdVFJLHH9o4q8XNV7", description: 'High-altitude lake known for its changing colors and stunning Himalayan backdrop.', price: 150, imageSlug: 'pangong-lake-ladakh', location: 'Leh, Ladakh', coordinates: { lat: 33.7558, lng: 78.6661 }, state: "Ladakh", theme: "Nature" },
  { id: 'la2', name: 'Nubra Valley', image: "/Nubra Valley.jpg",maplink: "https://maps.app.goo.gl/RhfTr1pF54afUhbu9", description: 'High-altitude cold desert with sand dunes, Bactrian camels, and monasteries.', price: 250, imageSlug: 'nubra-valley-camels-ladakh', location: 'Leh, Ladakh', coordinates: { lat: 34.6800, lng: 77.5600 }, state: "Ladakh", theme: "Adventure" },
  { id: 'la3', name: 'Leh Palace', image: "/Leh palace.jpg",maplink: "https://maps.app.goo.gl/HHz3G9kaYDgYd4337", description: 'Former royal palace overlooking the town of Leh, built in Tibetan architectural style.', price: 50, imageSlug: 'leh-palace-ladakh', location: 'Leh, Ladakh', coordinates: { lat: 34.1650, lng: 77.5850 }, state: "Ladakh", theme: "Historical" },
  { id: 'la4', name: 'Magnetic Hill', image: "/Magnetic Hill, Laddakh, India.jpg",maplink: "https://maps.app.goo.gl/tD1ChPW1vL9zwvTDA", description: 'Gravity hill where vehicles appear to roll uphill, a unique natural phenomenon.', price: 0, imageSlug: 'magnetic-hill-ladakh', location: 'Leh, Ladakh', coordinates: { lat: 34.1730, lng: 77.3500 }, state: "Ladakh", theme: "Nature" },
  // Andaman & Nicobar Islands (UT)
  { id: 'an1', name: 'Havelock Island (Swaraj Dweep)', image: "/andhaman beach.jpg",maplink: "https://maps.app.goo.gl/bSoeTmYv6LL2yQWK9", description: 'Famous for Radhanagar Beach, snorkeling, and scuba diving.', price: 300, imageSlug: 'havelock-island-beach-andaman', location: 'South Andaman, Andaman & Nicobar Islands', coordinates: { lat: 12.0200, lng: 92.9800 }, state: "Andaman & Nicobar Islands", theme: "Beaches" },
  { id: 'an2', name: 'Cellular Jail', image: "/Cellular Jail.jpg",maplink: "https://maps.app.goo.gl/SC8LKSBeejNxCyDx9", description: 'Former colonial prison, now a national memorial, narrating India\'s freedom struggle.', price: 30, imageSlug: 'cellular-jail-port-blair-andaman', location: 'Port Blair, Andaman & Nicobar Islands', coordinates: { lat: 11.6720, lng: 92.7590 }, state: "Andaman & Nicobar Islands", theme: "Historical" },
  { id: 'an3', name: 'Radhanagar Beach', image: "/Radhanagar Beach, Andaman and Nicobar Islands.jpg",maplink: "https://maps.app.goo.gl/bjcLyZZuv9nSiFJ5A", description: 'Often rated as one of Asia\'s best beaches, known for its white sands and turquoise waters.', price: 0, imageSlug: 'radhanagar-beach-andaman', location: 'Havelock Island, Andaman & Nicobar Islands', coordinates: { lat: 12.0000, lng: 92.9500 }, state: "Andaman & Nicobar Islands", theme: "Beaches" },
  { id: 'an4', name: 'Ross Island (Netaji Subhas Chandra Bose Dweep)', image: "/Havelock island.jpg",maplink: "https://maps.app.goo.gl/PqaFgHjQSfW4rf1a7", description: 'Former administrative headquarters, now with ruins, deer, and peacocks.', price: 50, imageSlug: 'ross-island-ruins-andaman', location: 'South Andaman, Andaman & Nicobar Islands', coordinates: { lat: 11.6800, lng: 92.7600 }, state: "Andaman & Nicobar Islands", theme: "Historical" },
  // Chandigarh (UT)
  { id: 'ch1', name: 'Rock Garden', image: "/Rock Garden Chandigarh.jpg",maplink: "https://maps.app.goo.gl/MP5yU8b1jyntJL9a6", description: 'Unique sculpture garden created from industrial and home waste by Nek Chand.', price: 30, imageSlug: 'rock-garden-chandigarh', location: 'Chandigarh', coordinates: { lat: 30.7525, lng: 76.8100 }, state: "Chandigarh", theme: "Art & Culture" },
  { id: 'ch2', name: 'Sukhna Lake', image: "/sukhna lake chandigarh.jpg",maplink: "https://maps.app.goo.gl/CZwSyJ4JBw8waQTc6", description: 'Man-made reservoir, a popular spot for boating, walking, and enjoying sunsets.', price: 0, imageSlug: 'sukhna-lake-chandigarh', location: 'Chandigarh', coordinates: { lat: 30.7420, lng: 76.8180 }, state: "Chandigarh", theme: "Nature" },
  { id: 'ch3', name: 'Rose Garden (Zakir Hussain Rose Garden)', image: "/rose garden.jpg",maplink: "https://maps.app.goo.gl/5ArSa8HhpF1FBNDTA", description: 'Asia\'s largest rose garden, featuring thousands of rose varieties.', price: 0, imageSlug: 'rose-garden-chandigarh', location: 'Chandigarh', coordinates: { lat: 30.7400, lng: 76.7900 }, state: "Chandigarh", theme: "Nature" },
  { id: 'ch4', name: 'Capitol Complex', image: "/capitol complex.jpeg",maplink: "https://maps.app.goo.gl/XD8CLXXk1adEBK4ZA", description: 'UNESCO World Heritage site designed by Le Corbusier, showcasing modernist architecture.', price: 0, imageSlug: 'capitol-complex-chandigarh', location: 'Chandigarh', coordinates: { lat: 30.7570, lng: 76.8000 }, state: "Chandigarh", theme: "Historical" },
];
const TouristPlacesPage = () => {
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  const uniqueStates = [...new Set(allIndianPlaces.map(place => place.state))].sort();
  const uniqueThemes = [...new Set(allIndianPlaces.map(place => place.theme))].sort();


  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        let storedPlaces = localStorage.getItem('touristPlacesIndia');
        if (storedPlaces) {
          const parsedPlaces = JSON.parse(storedPlaces);
          const updatedParsedPlaces = parsedPlaces.map(p => ({ ...p, price: p.price === undefined ? 0 : p.price }));

          if (JSON.stringify(updatedParsedPlaces) !== JSON.stringify(allIndianPlaces.map(p => ({ ...p, price: p.price === undefined ? 0 : p.price })))) {
            localStorage.setItem('touristPlacesIndia', JSON.stringify(allIndianPlaces));
            setAllPlaces(allIndianPlaces);
            setFilteredPlaces(allIndianPlaces);
          } else {
            setAllPlaces(updatedParsedPlaces);
            setFilteredPlaces(updatedParsedPlaces);
          }
        } else {
          const initializedPlaces = allIndianPlaces.map(p => ({ ...p, price: p.price === undefined ? 0 : p.price }));
          localStorage.setItem('touristPlacesIndia', JSON.stringify(initializedPlaces));
          setAllPlaces(initializedPlaces);
          setFilteredPlaces(initializedPlaces);
        }
        if (!loading) {
          toast({ title: "Places Loaded!", description: "Explore amazing destinations across India." });
        }
      } catch (error) {
        console.error("Failed to fetch places:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load tourist places." });
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (!loading && allPlaces.length > 0) {

    }
  }, [loading, allPlaces, toast]);

  useEffect(() => {
    let currentPlaces = [...allPlaces];
    if (searchTerm) {
      currentPlaces = currentPlaces.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedState) {
      currentPlaces = currentPlaces.filter(place => place.state === selectedState);
    }
    if (selectedTheme) {
      currentPlaces = currentPlaces.filter(place => place.theme === selectedTheme);
    }
    setFilteredPlaces(currentPlaces);
  }, [searchTerm, selectedState, selectedTheme, allPlaces]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 p-4 md:p-8">
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
          Discover Incredible India
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Browse our curated list of stunning tourist destinations from every corner of India. Use the filters to find your perfect getaway!
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 p-6 rounded-xl shadow-lg glassmorphic sticky top-24 z-40 bg-background/80 backdrop-blur-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, location..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="state-filter" className="block text-sm font-medium text-muted-foreground mb-1">Filter by State</label>
            <select
              id="state-filter"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States & UTs</option>
              {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="theme-filter" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Theme</label>
            <select
              id="theme-filter"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="">All Themes</option>
              {uniqueThemes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
            </select>
          </div>
          <Button
            onClick={() => { setSearchTerm(''); setSelectedState(''); setSelectedTheme(''); }}
            variant="outline"
            className="w-full md:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        </div>
      </motion.div>

      {filteredPlaces.length === 0 && !loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xl text-muted-foreground py-10"
        >
          No places found matching your criteria. Try adjusting your filters!
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlaces.map((place, index) => (
            <TouristPlaceCard key={place.id || index} place={place} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TouristPlacesPage;
