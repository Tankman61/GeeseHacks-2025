import React, { useEffect, useState } from "react";

interface Activity {
  title: string;
  participants: string;
  location: string;
  image: string;
}

interface Person {
  name: string;
  age: number;
  major: string;
  interests: string[];
  description: string;
  distance: number; // Fake distance to simulate proximity
}

const Map: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    // Fetch activities and people JSON data
    fetch("../public/locations.json")
      .then((response) => response.json())
      .then((data) => setActivities(data.sort(() => 0.5 - Math.random()).slice(0, 2)))
      .catch((error) => console.error("Failed to load activities:", error));

    fetch("../public/people.json")
      .then((response) => response.json())
      .then((data) => {
        // Add fake distance to each person
        const peopleWithDistance = data.map((person: Person) => ({
          ...person,
          distance: Math.floor(Math.random() * 5) + 1, // Fake distance between 1 and 5 km
        }));
        setPeople(peopleWithDistance);
      })
      .catch((error) => console.error("Failed to load people:", error));
  }, []);

  const generateNewGroup = () => {
    // Generate a random group of 9 people
    if (people.length >= 9) {
      const shuffled = people.sort(() => 0.5 - Math.random()).slice(0, 9);
      setCurrentGroup(shuffled);
    }
  };

  useEffect(() => {
    generateNewGroup(); // Generate a group when component loads
  }, [people]);

  const handleInterestChange = () => {
    generateNewGroup(); // Regenerate group on interest change
    setSelectedPerson(null); // Reset selected person
  };

  const handleIconClick = (index: number) => {
    setSelectedPerson(currentGroup[index] || null); // Set selected person
  };

  const groupByDistance = (people: Person[]) => {
    // Group people by fake distance
    const within1km = people.filter((person) => person.distance === 1);
    const within3km = people.filter((person) => person.distance === 2 || person.distance === 3);
    const within5km = people.filter((person) => person.distance === 4 || person.distance === 5);
    return { within1km, within3km, within5km };
  };

  const { within1km, within3km, within5km } = groupByDistance(currentGroup);

  return (
    <div className="p-6 bg-gray-100 text-gray-800">
      {/* Greeting and Search Bar */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-800">Hello, Edward 👋</h1>
        <input
          type="text"
          placeholder="What do you want to do today?"
          className="mt-4 px-4 py-2 w-full max-w-md border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Map Section */}
      <div className="relative mb-8">
        <div className="w-full h-72 bg-gray-300 rounded-lg shadow-md relative">
          <img
            src="/mnt/data/image.png" // Replace with your actual map image path
            alt="Map"
            className="w-full h-full object-cover rounded-lg"
          />
          {selectedPerson && (
            <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedPerson.name} ({selectedPerson.age})
              </h3>
              <p className="text-gray-600">Major: {selectedPerson.major}</p>
              <p className="text-gray-600">
                Interests: {selectedPerson.interests.join(", ")}
              </p>
              <p className="text-gray-600">{selectedPerson.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ongoing Activities Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4 text-blue-800 text-center">Ongoing Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                  <p className="text-gray-600">{activity.participants}</p>
                  <p className="text-gray-600">{activity.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* New Button for Adding Activity */}
          <div className="flex justify-center mt-6">
            <button className="px-4 py-2 bg-blue-800 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 max-w-3xl w-full">
              + Add a new activity
            </button>
          </div>
        </div>

        {/* Choose Interest Section */}
        <div className="flex flex-col items-center mt-8 max-w-xs">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Choose an Interest</h3>
          <select
            className="mb-4 px-4 py-2 w-full max-w-xs border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleInterestChange}
          >
            <option>Food</option>
            <option>Sports</option>
            <option>Music</option>
          </select>

          {/* Group 1km */}
          {within1km.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Within 1km</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {within1km.map((person, index) => (
                  <div
                    key={index}
                    onClick={() => handleIconClick(index)}
                    className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold flex items-center justify-center cursor-pointer hover:bg-blue-200"
                  >
                    {person.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 3km */}
          {within3km.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Within 3km</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {within3km.map((person, index) => (
                  <div
                    key={index}
                    onClick={() => handleIconClick(index)}
                    className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold flex items-center justify-center cursor-pointer hover:bg-blue-200"
                  >
                    {person.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 5km */}
          {within5km.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Within 5km</h4>
              <div className="grid grid-cols-3 gap-4">
                {within5km.map((person, index) => (
                  <div
                    key={index}
                    onClick={() => handleIconClick(index)}
                    className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold flex items-center justify-center cursor-pointer hover:bg-blue-200"
                  >
                    {person.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
