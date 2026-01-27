'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, MapPin, Tag, FileText, Filter, Building, Upload } from 'lucide-react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

interface Project {
  _id: string;  // Changed from id to _id to match MongoDB
  name: string;
  builder: string;
  location: string;
  price: string;
  type: string;
  zone: string;
  offer?: string;
  image: string;
  status: 'Active' | 'Inactive' | 'Draft';
  description?: string;
  pdfUrl?: string;  // Added for PDF URL
}

export default function ProjectsPage() {
   const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectZoneFilter, setProjectZoneFilter] = useState('All');
  const [projectLocationFilter, setProjectLocationFilter] = useState('');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const router = useRouter();

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/projects?zone=${projectZoneFilter === 'All' ? '' : projectZoneFilter}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [projectZoneFilter]);
  // Handle project creation
  const handleAddProject = async (projectData: Omit<Project, '_id' | 'status'>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          status: 'Active' as const,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }
      await fetchProjects(); // Refresh the projects list
      return true;
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return false;
    }
  };
  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
      await fetchProjects(); // Refresh the projects list
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };
  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      const data = await response.json();
      return data.url; // Return the URL of the uploaded file
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  };

 const filteredProjects = projects.filter(project => {
  const matchesZone = projectZoneFilter === 'All' || project.zone === projectZoneFilter;
  const searchTerm = projectLocationFilter.toLowerCase();
  
  // Add null checks for project properties
  const projectName = project.name?.toLowerCase() || '';
  const projectLocation = project.location?.toLowerCase() || '';
  const projectBuilder = project.builder?.toLowerCase() || '';
  
  return (
    (projectName.includes(searchTerm) ||
     projectLocation.includes(searchTerm) ||
     projectBuilder.includes(searchTerm)) &&
    matchesZone
  );
});

 if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Our Projects</h2>
          <p className="text-sm text-slate-500">
            Manage listings and brochures
          </p>
        </div>
        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filters:</span>
        </div>
        <select
          value={projectZoneFilter}
          onChange={(e) => setProjectZoneFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Zones</option>
          <option value="West">West Mumbai</option>
          <option value="Central">Central Suburbs</option>
          <option value="South">South Mumbai</option>
          <option value="East">East Suburbs</option>
          <option value="North">North Mumbai</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={projectLocationFilter}
            onChange={(e) => setProjectLocationFilter(e.target.value)}
            placeholder="Search by Location or Project Name..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
          >
            <div className="h-48 bg-slate-200 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                {project.zone}
              </div>
              {project.offer && (
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/90 text-yellow-950 text-xs font-bold px-3 py-1.5 flex items-center justify-center gap-1">
                  <Tag size={12} /> {project.offer}
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {project.name}
                </h3>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {project.builder}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                <MapPin size={12} /> {project.location}
              </p>

              <div className="mt-auto space-y-3">
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-800">
                    {project.price}
                  </span>
                  <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                    {project.type}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    // Handle view brochure
                    console.log('View brochure for:', project.name);
                  }}
                  className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText size={16} /> View Brochure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <p className="text-center text-slate-400 py-12">
          No projects found matching filters.
        </p>
      )}

      {/* Add Project Modal - You'll need to implement this */}
     <AddProjectModal 
        isOpen={isAddProjectModalOpen} 
        onClose={() => {
          setIsAddProjectModalOpen(false);
          setError(null);
        }}
        onAdd={async (projectData: any) => {
          const success = await handleAddProject(projectData);
          if (success) {
            setIsAddProjectModalOpen(false);
          }
        }}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}
const AddProjectModal = ({ 
  isOpen, 
  onClose, 
  onAdd,
  onFileUpload
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: any;
  onFileUpload: (file: File) => Promise<string>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const projectData: any = {
        name: formData.get("name") as string,
        builder: formData.get("builder") as string,
        location: formData.get("location") as string,
        zone: formData.get("zone") as string,
        price: formData.get("price") as string,
        type: formData.get("type") as string,
        offer: formData.get("offer") as string || undefined,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400", // Default image
      };
      // Handle PDF upload if a file is selected
      if (pdfFile) {
        try {
          const pdfUrl = await onFileUpload(pdfFile);
          projectData.pdfUrl = pdfUrl;
        } catch (err) {
          throw new Error('Failed to upload PDF. Please try again.');
        }
      }
      const success = await onAdd(projectData);
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 sticky top-0 z-10">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Building size={20} /> Add New Project
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
            disabled={isSubmitting}
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Skyline Towers"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Builder <span className="text-red-500">*</span>
              </label>
              <input
                name="builder"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Lodha"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Zone <span className="text-red-500">*</span>
              </label>
              <select
                name="zone"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                disabled={isSubmitting}
                required
              >
                <option value="Central">Central</option>
                <option value="West">West</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="North">North</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Andheri West"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Configuration
              </label>
              <input
                name="type"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 2 & 3 BHK"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price Range <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 1.5 Cr - 2.2 Cr"
              disabled={isSubmitting}
            />
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <label className="block text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
              <Tag size={16} /> Project Offer / Deal
            </label>
            <input
              name="offer"
              className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
              placeholder="e.g. No GST, Free Car Parking"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Brochure (PDF) <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                name="pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              {pdfFile ? (
                <div className="text-center">
                  <FileText size={24} className="text-blue-500 mb-2 mx-auto" />
                  <span className="text-sm text-slate-700 block truncate max-w-xs">
                    {pdfFile.name}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">
                    Click to upload or drag & drop
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    PDF up to 10MB
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'List Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};