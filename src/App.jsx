import { useEffect, useState } from "react";

const channelId = "UCKwQa5DB_VR98ac_r-Wyl-g";
const proxy = "https://api.allorigins.win/raw?url=";
const playlistsRSS = `https://rsshub.app/youtube/channel/${channelId}/playlists`;
const uploadsRSS = `https://rsshub.app/youtube/channel/${channelId}`;

function App() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [search, setSearch] = useState("");

  async function fetchXML(url) {
    const res = await fetch(proxy + encodeURIComponent(url));
    const text = await res.text();
    return new window.DOMParser().parseFromString(text, "text/xml");
  }

  async function fetchPlaylists() {
    try {
      const xml = await fetchXML(playlistsRSS);
      const items = xml.getElementsByTagName("item");
      const loaded = Array.from(items).map((item) => {
        const title = item.getElementsByTagName("title")[0]?.textContent;
        const link = item.getElementsByTagName("link")[0]?.textContent;
        const urlParams = new URLSearchParams(new URL(link).search);
        const playlistId = urlParams.get("list");
        return { title, id: playlistId };
      });
      setPlaylists(loaded);
    } catch (err) {
      console.error("Failed to load playlists", err);
    }
  }

  async function loadVideos(playlistId = "") {
    const feedUrl = playlistId
      ? `https://rsshub.app/youtube/playlist/${playlistId}`
      : uploadsRSS;
    try {
      const xml = await fetchXML(feedUrl);
      const items = xml.getElementsByTagName("item");
      const loaded = Array.from(items).map((item) => {
        const title = item.getElementsByTagName("title")[0]?.textContent;
        const link = item.getElementsByTagName("link")[0]?.textContent;
        const videoId = new URL(link).searchParams.get("v");
        return { title, videoId };
      });
      setVideos(loaded);
      setFilteredVideos(loaded);
    } catch (err) {
      console.error("Failed to load videos", err);
    }
  }

  function handleSearch() {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredVideos(videos);
      return;
    }
    const matched = videos.filter(video =>
      video.title.toLowerCase().includes(query)
    );
    setFilteredVideos(matched);
  }

  useEffect(() => {
    fetchPlaylists();
    loadVideos();
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      loadVideos(selectedPlaylist);
    } else {
      loadVideos();
    }
  }, [selectedPlaylist]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        Mercaz Daf Yomi Video Browser
      </h1>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Videos</option>
          {playlists.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.title}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search videos"
          className="p-2 border rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVideos.length === 0 ? (
          <p className="text-center col-span-full italic">No videos found.</p>
        ) : (
          filteredVideos.map((video) => (
            <div key={video.videoId} className="bg-gray-100 p-2 rounded">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
              <p className="mt-2 text-sm">{video.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;