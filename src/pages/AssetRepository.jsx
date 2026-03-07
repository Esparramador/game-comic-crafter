import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AssetRepository() {
  const [assets, setAssets] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetsData, charactersData, projectsData] = await Promise.all([
        base44.entities.AssetRepository.list('-created_date', 100),
        base44.entities.GameCharacter.list('-created_date', 100),
        base44.entities.GameProject.list('-created_date', 100)
      ]);
      
      setAssets(assetsData || []);
      setCharacters(charactersData || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      character: 'bg-purple-100 text-purple-800',
      model_3d: 'bg-blue-100 text-blue-800',
      texture: 'bg-green-100 text-green-800',
      voice: 'bg-orange-100 text-orange-800',
      script: 'bg-red-100 text-red-800',
      sprite_sheet: 'bg-pink-100 text-pink-800',
      game_build: 'bg-indigo-100 text-indigo-800',
      marketing_asset: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 Asset Repository</h1>
          <p className="text-slate-400">Todos los assets, personajes y proyectos de tu juego</p>
        </div>

        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="assets">
              Assets ({assets.length})
            </TabsTrigger>
            <TabsTrigger value="characters">
              Personajes ({characters.length})
            </TabsTrigger>
            <TabsTrigger value="projects">
              Proyectos ({projects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-4">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">Todos los tipos</option>
                <option value="character">Character</option>
                <option value="model_3d">3D Model</option>
                <option value="texture">Texture</option>
                <option value="voice">Voice</option>
                <option value="script">Script</option>
                <option value="sprite_sheet">Sprite Sheet</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center text-slate-400">Cargando assets...</div>
              ) : filteredAssets.length === 0 ? (
                <div className="col-span-full text-center text-slate-400">No hay assets disponibles</div>
              ) : (
                filteredAssets.map(asset => (
                  <Card key={asset.id} className="bg-slate-700 border-slate-600 hover:border-purple-500 transition">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg text-white">{asset.name}</CardTitle>
                        <Badge className={getTypeColor(asset.type)}>{asset.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-300">
                        {asset.format && <p>Formato: <span className="text-white font-semibold">{asset.format}</span></p>}
                        {asset.file_size_mb && <p>Tamaño: <span className="text-white font-semibold">{asset.file_size_mb} MB</span></p>}
                      </div>
                      {asset.tags && asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs text-slate-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                        <Download className="h-4 w-4" />
                        Descargar
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="characters" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center text-slate-400">Cargando personajes...</div>
              ) : characters.length === 0 ? (
                <div className="col-span-full text-center text-slate-400">No hay personajes disponibles</div>
              ) : (
                characters.map(char => (
                  <Card key={char.id} className="bg-slate-700 border-slate-600 hover:border-purple-500 transition">
                    <CardHeader>
                      <CardTitle className="text-white">{char.name}</CardTitle>
                      <p className="text-sm text-slate-400">{char.archetype}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-300">{char.bio}</p>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-600">{char.gender}</Badge>
                        <Badge className="bg-purple-600">{char.behavior_logic}</Badge>
                      </div>
                      {char.tags && (
                        <div className="flex flex-wrap gap-1">
                          {char.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs text-slate-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="text-center text-slate-400">Cargando proyectos...</div>
              ) : projects.length === 0 ? (
                <div className="text-center text-slate-400">No hay proyectos disponibles</div>
              ) : (
                projects.map(project => (
                  <Card key={project.id} className="bg-slate-700 border-slate-600 hover:border-purple-500 transition">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{project.title}</CardTitle>
                          <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                        </div>
                        <Badge className="bg-green-600">{project.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                        <div>Género: <span className="text-white font-semibold">{project.genre}</span></div>
                        <div>Formato: <span className="text-white font-semibold">{project.format}</span></div>
                        <div>Motor: <span className="text-white font-semibold">{project.engine}</span></div>
                        <div>Personajes: <span className="text-white font-semibold">{project.character_ids?.length || 0}</span></div>
                      </div>
                      {project.playable_url && (
                        <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                          ▶ Jugar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}