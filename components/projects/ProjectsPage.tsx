'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Plus, MapPin, Tag, FileText, Filter, Building, Upload } from 'lucide-react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface Project {
  _id: string;
  name: string;
  builder: string;
  projectType?: string;
  propertyCity?: string;
  locality?: string;
  address?: string;
  pincode?: string;
  offerPrice?: string;
  startingPrice?: string;
  type?: string;
  zone?: string;
  configuration?: string;
  // offer?: string;
  image?: string;
  thumbnail?: string;
  propertyImages?: string[];
  status?: 'Pre-Launch' | 'New Launch' | 'Under Construction' | 'Ready To Move';
  description?: string;
  brochureUrl?: string;
  pdfUrl?: string;
  reraNumber?: string;
  googleMapLink?: string;
  amenities?: string[];
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectZoneFilter, setProjectZoneFilter] = useState('All');
  const [projectLocationFilter, setProjectLocationFilter] = useState('');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [selectedBrochure, setSelectedBrochure] = useState<{ projectName: string; url: string } | null>(null);
  const [selectedProjectView, setSelectedProjectView] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
      setProjects(Array.isArray(data) ? data : []);
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
  const handleAddProject = async (projectData: Omit<Project, '_id'>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          status: projectData.status || ('New Launch' as const),
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

  // Handle project update
  const handleUpdateProject = async (projectId: string, projectData: Partial<Project>) => {
    console.log('Updating project with data:', projectData);
    try {
      const response = await fetch(`/api/projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...projectData, _id: projectId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }
      await fetchProjects();
      return true;
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to update project');
      return false;
    }
  };
  // Handle project deletion
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      setError(null);
      const response = await fetch(`/api/projects?id=${projectToDelete._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
      setProjectToDelete(null);
      await fetchProjects(); // Refresh the projects list
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };
  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, data: base64Data }),
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

  const filteredProjects = (Array.isArray(projects) ? projects : []).filter(project => {
    const matchesZone = projectZoneFilter === 'All' || project.zone === projectZoneFilter;
    const searchTerm = projectLocationFilter.toLowerCase();

    // Add null checks for project properties
    const projectName = project.name?.toLowerCase() || '';
    const projectLocation = project.locality?.toLowerCase() || '';
    const projectCity = project.propertyCity?.toLowerCase() || '';
    const projectBuilder = project.builder?.toLowerCase() || '';

    return (
      (projectName.includes(searchTerm) ||
        projectLocation.includes(searchTerm) ||
        projectCity.includes(searchTerm) ||
        projectBuilder.includes(searchTerm)) &&
      matchesZone
    );
  });

  if (loading && (Array.isArray(projects) ? projects.length === 0 : true)) {
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
        {session?.user?.permissions?.canCreateProjects && (
          <button
            onClick={() => setIsAddProjectModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> Add Project
          </button>
        )}
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
          <option value="West">West</option>
          <option value="Central">Central</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="North">North</option>
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
                src={project.image || project.thumbnail || project.propertyImages?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                {project.zone}
              </div>
              {project.offerPrice && (
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/90 text-yellow-950 text-xs font-bold px-3 py-1.5 flex items-center justify-center gap-1">
                  <Tag size={12} /> {project.offerPrice}
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
                <MapPin size={12} /> {project.locality || project.propertyCity || 'N/A'}
              </p>

              <div className="mt-auto space-y-3">
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-800">
                    {project.startingPrice}
                  </span>
                  <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                    {project.projectType}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedProjectView(project)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      const brochureUrl = project.pdfUrl || project.brochureUrl;
                      if (brochureUrl) {
                        setSelectedBrochure({ projectName: project.name, url: brochureUrl });
                      } else {
                        alert('No brochure available for this project');
                      }
                    }}
                    className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText size={16} /> View Brochure
                  </button>
                </div>
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

      {/* Add Project Modal */}
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

      {/* Edit Project Modal */}
      {editingProject && (
        <AddProjectModal
          isOpen={true}
          onClose={() => setEditingProject(null)}
          onAdd={async (projectData: any) => {
            const success = await handleUpdateProject(editingProject._id, projectData);
            if (success) {
              setEditingProject(null);
            }
          }}
          onFileUpload={handleFileUpload}
          initialProject={editingProject}
        />
      )}

      {/* View Project Details Modal */}
      {selectedProjectView && (
        <ProjectDetailsModal
          project={selectedProjectView}
          onClose={() => setSelectedProjectView(null)}
          onEdit={(project) => {
            setSelectedProjectView(null);
            setEditingProject(project);
          }}
          onDelete={(project) => {
            setSelectedProjectView(null);
            setProjectToDelete(project);
          }}
          canEdit={!!session?.user?.permissions?.canEditProjects}
          canDelete={!!session?.user?.permissions?.canDeleteProjects}
        />
      )}

      {/* Brochure Preview Modal */}
      {selectedBrochure && (
        <BrochurePreviewModal
          projectName={selectedBrochure.projectName}
          brochureUrl={selectedBrochure.url}
          onClose={() => setSelectedBrochure(null)}
        />
      )}

      <Modal
        isOpen={!!projectToDelete}
        onClose={() => !isDeleting && setProjectToDelete(null)}
        title="Delete Project"
        type="danger"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-800">{projectToDelete?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setProjectToDelete(null)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
const AddProjectModal = ({
  isOpen,
  onClose,
  onAdd,
  onFileUpload,
  initialProject
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: any;
  onFileUpload: (file: File) => Promise<string>;
  initialProject?: Project;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialProject?.image || initialProject?.thumbnail || null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(initialProject?.pdfUrl || initialProject?.brochureUrl || null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(initialProject?.pdfUrl || initialProject?.brochureUrl || null);

  useEffect(() => {
    if (!isOpen) return;
    const initialImage =
      initialProject?.image ||
      initialProject?.thumbnail ||
      initialProject?.propertyImages?.[0] ||
      null;
    const initialPdf =
      initialProject?.pdfUrl || initialProject?.brochureUrl || null;

    setUploadedImageUrl(initialImage);
    setUploadedPdfUrl(initialPdf);
    setPdfPreview(initialPdf);
    setPdfFile(null);
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError(null);
    try {
      const url = await onFileUpload(file);
      setUploadedImageUrl(url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setError(null);
    try {
      const url = await onFileUpload(file);
      setUploadedPdfUrl(url);
      setPdfFile(file);
      setPdfPreview(url);
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError('Failed to upload brochure. Please try again.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const projectData: any = {
        name: formData.get("name") as string,
        builder: formData.get("builder") as string,
        projectType: (formData.get("projectType") as string) || undefined,
        status: (formData.get("status") as string) || undefined,
        propertyCity: formData.get("propertyCity") as string,
        locality: formData.get("locality") as string,
        address: formData.get("address") as string,
        pincode: formData.get("pincode") as string,
        zone: formData.get("zone") as string,
        configuration: formData.get("configuration") as string,
        startingPrice: formData.get("startingPrice") as string,
        offerPrice: (formData.get("offerPrice") as string) || undefined,
        reraNumber: (formData.get("reraNumber") as string) || undefined,
        googleMapLink: (formData.get("googleMapLink") as string) || undefined,
        amenities: (() => {
          const value = (formData.get("amenities") as string) || '';
          return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        })(),
        ...(uploadedImageUrl ? { image: uploadedImageUrl, thumbnail: uploadedImageUrl } : {}),
      };
      // Use uploaded PDF URL if available
      if (uploadedPdfUrl) {
        projectData.pdfUrl = uploadedPdfUrl;
        projectData.brochureUrl = uploadedPdfUrl;
      }
      const success = await onAdd(projectData);
      if (success) {
        setUploadedImageUrl(null);
        setUploadedPdfUrl(null);
        setPdfFile(null);
        setPdfPreview(null);
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
      <div className="bg-white rounded-2xl w-full h-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 sticky top-0 z-10">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Building size={20} /> {initialProject ? 'Edit Project' : 'Add New Project'}
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
              defaultValue={initialProject?.name || ''}
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
                defaultValue={initialProject?.builder || ''}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Lodha"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project Type <span className="text-red-500">*</span>
              </label>
              <select
                name="projectType"
                defaultValue={initialProject?.projectType || 'Apartment'}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                disabled={isSubmitting}
                required
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Zone
              </label>
              <select
                name="zone"
                defaultValue={initialProject?.zone || 'Central'}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                disabled={isSubmitting}
              >
                <option value="Central">Central</option>
                <option value="West">West</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="North">North</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={initialProject?.status || 'New Launch'}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                disabled={isSubmitting}
              >
                <option value="Pre-Launch">Pre-Launch</option>
                <option value="New Launch">New Launch</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Ready To Move">Ready To Move</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="propertyCity"
                defaultValue={initialProject?.propertyCity || ''}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Mumbai"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Locality
              </label>
              <input
                name="locality"
                defaultValue={initialProject?.locality || ''}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Andheri West"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                name="address"
                defaultValue={initialProject?.address || ''}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Street, area, landmark"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pincode
              </label>
              <input
                name="pincode"
                defaultValue={initialProject?.pincode || ''}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 400001"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Configuration
              </label>
              <input
                name="configuration"
                defaultValue={initialProject?.configuration || ''}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 2 & 3 BHK"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Starting Price <span className="text-red-500">*</span>
              </label>
              <input
                name="startingPrice"
                defaultValue={initialProject?.startingPrice as any || ''}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 1.5 Cr - 2.2 Cr"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                RERA Number
              </label>
              <input
                name="reraNumber"
                defaultValue={initialProject?.reraNumber || ''}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. P123456789"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Google Map Link
              </label>
              <input
                name="googleMapLink"
                defaultValue={initialProject?.googleMapLink || ''}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://maps.google.com/..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amenities (comma separated)
            </label>
            <input
              name="amenities"
              defaultValue={(initialProject?.amenities || []).join(', ')}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Gym, Pool, Club House"
              disabled={isSubmitting}
            />
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <label className="block text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
              <Tag size={16} /> Project Offer / Deal
            </label>
            <input
              name="offerPrice"
              defaultValue={initialProject?.offerPrice || ''}
              className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
              placeholder="e.g. No GST, Free Car Parking"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Project Image <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
                disabled={isSubmitting || isUploadingImage}
              />
              {uploadedImageUrl ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-slate-200">
                    <img src={uploadedImageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-green-600 font-semibold block">✓ Image uploaded successfully</span>
                  <span className="text-xs text-slate-500 mt-1 block">Click again to replace</span>
                </div>
              ) : isUploadingImage ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2" />
                  <span className="text-sm text-slate-600">Uploading image...</span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">
                    Click to upload or drag & drop
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Brochure (PDF) <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handlePdfUpload}
                disabled={isSubmitting || isUploadingPdf}
              />
              {uploadedPdfUrl ? (
                <div className="text-center">
                  <FileText size={24} className="text-green-500 mb-2 mx-auto" />
                  <span className="text-sm text-green-600 font-semibold block">✓ Brochure uploaded successfully</span>
                  <span className="text-xs text-slate-500 mt-1 block">Click again to replace</span>
                </div>
              ) : isUploadingPdf ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2" />
                  <span className="text-sm text-slate-600">Uploading brochure...</span>
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
              className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
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

const BrochurePreviewModal = ({ projectName, brochureUrl, onClose }: { projectName: string; brochureUrl: string; onClose: () => void }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = `${projectName}-brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full h-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 sticky top-0 z-10">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <FileText size={20} /> {projectName} - Brochure
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-slate-100 flex flex-col">
          <iframe
            src={brochureUrl}
            className="flex-1 w-full border-0"
            title={`${projectName} Brochure`}
          />
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailsModal = ({
  project,
  onClose,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  project: Project;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  canEdit: boolean;
  canDelete: boolean;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 sticky top-0 z-10">
          <h3 className="font-bold text-lg text-slate-800">{project.name}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Image */}
          <div className="w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
            <img
              src={project.image || project.thumbnail || project.propertyImages?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Builder</p>
              <p className="text-sm font-semibold text-slate-800">{project.builder}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Project Type</p>
              <p className="text-sm font-semibold text-slate-800">{project.projectType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
              <p className="text-sm font-semibold text-slate-800">{project.propertyCity || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Configuration</p>
              <p className="text-sm font-semibold text-slate-800">{project.configuration || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Locality</p>
              <p className="text-sm font-semibold text-slate-800">{project.locality || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Pincode</p>
              <p className="text-sm font-semibold text-slate-800">{project.pincode || 'N/A'}</p>
            </div>
          </div>

          {/* Price and Status */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Starting Price</p>
                <p className="text-lg font-bold text-slate-800">{project.startingPrice ? `₹${project.startingPrice}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
                <p className="text-sm font-semibold text-green-600">{project.status || 'New Launch'}</p>
              </div>
            </div>
          </div>

          {/* Offer */}
          {project.offerPrice && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-700 font-semibold uppercase mb-1">Special Offer</p>
              <p className="text-sm font-semibold text-yellow-900">{project.offerPrice}</p>
            </div>
          )}

          {/* Additional Details */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-800 mb-3">Additional Details</h4>
            <div className="space-y-2 text-sm">
              {project.projectType && (
                <p><span className="font-semibold">Project Type:</span> {project.projectType}</p>
              )}
              {project.propertyCity && (
                <p><span className="font-semibold">City:</span> {project.propertyCity}</p>
              )}
              {project.locality && (
                <p><span className="font-semibold">Locality:</span> {project.locality}</p>
              )}
              {project.address && (
                <p><span className="font-semibold">Address:</span> {project.address}</p>
              )}
              {project.pincode && (
                <p><span className="font-semibold">Pincode:</span> {project.pincode}</p>
              )}
              {project.reraNumber && (
                <p><span className="font-semibold">RERA Number:</span> {project.reraNumber}</p>
              )}
              {project.googleMapLink && (
                <p>
                  <span className="font-semibold">Google Map:</span>{' '}
                  <a
                    href={project.googleMapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open Map
                  </a>
                </p>
              )}
              {project.amenities && project.amenities.length > 0 && (
                <p><span className="font-semibold">Amenities:</span> {project.amenities.join(', ')}</p>
              )}
              {project.description && (
                <p><span className="font-semibold">Description:</span> {project.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          {canEdit && (
            <button
              onClick={() => onEdit(project)}
              className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(project)}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};