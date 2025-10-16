'use client';

import { faker } from '@faker-js/faker';
import {
  AlertCircle,
  Archive,
  Award,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  Grid3x3,
  Linkedin,
  Link as LinkIcon,
  List,
  Mail,
  MoreVertical,
  Search,
  Share2,
  Star,
  Trash2,
  Twitter,
  X,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { useCertificates } from '../hooks';
import { Certificate } from '../schemas';
import { useCertificatesStore } from '../store/certificate.store';

type ViewMode = 'grid' | 'list';
type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
type GridColumns = 2 | 3 | 4;

const createCertificate = (index: number): Certificate => {
  const issueDate = faker.date.past({ years: 2 });
  const hasExpiry = faker.datatype.boolean();
  const expiryDate = hasExpiry
    ? faker.date.future({ years: 1, refDate: issueDate })
    : null;

  return {
    id: faker.string.uuid(),
    title: faker.lorem
      .words({ min: 2, max: 4 })
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    issuer: faker.company.name(),
    issueDate: issueDate.toLocaleDateString('en-US'),
    expiryDate: expiryDate ? expiryDate.toLocaleDateString('en-US') : null,
    tags: faker.helpers.arrayElements(
      [
        'JavaScript',
        'ES6',
        'DOM Manipulation',
        'HTML5',
        'CSS3',
        'Responsive Design',
        'SQL',
        'Database Design',
        'Query Optimization',
        'React',
        'Node.js',
        'TypeScript',
      ],
      { min: 2, max: 4 }
    ),
    credentialId: `${faker.string.alphanumeric(4).toUpperCase()}-2024-${faker.string.numeric(3)}`,
    imageUrl: `https://picsum.photos/400/225?random=${index}`,
    description: faker.lorem.paragraph(),
    verificationUrl: faker.internet.url(),
    isFavorite: faker.datatype.boolean(),
    isArchived: false,
    notes: '',
  };
};

const isExpiringSoon = (expiryDate: string | null): boolean => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
};

const isExpired = (expiryDate: string | null): boolean => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

function CertificatesSearchBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  sortOption,
  onSortChange,
  allTags,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  onTagChange: (value: string | null) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  allTags: string[];
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search certificates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={selectedTag || 'all'}
          onValueChange={(val) => onTagChange(val === 'all' ? null : val)}
        >
          <SelectTrigger className="">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOption}
          onValueChange={(val) => onSortChange(val as SortOption)}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function CertificatesViewControls({
  viewMode,
  onViewModeChange,
  gridColumns,
  onGridColumnsChange,
  showFavoritesOnly,
  onFavoritesToggle,
  showArchivedOnly,
  onArchivedToggle,
  selectedCount,
  onBulkDownload,
  onBulkArchive,
  onBulkDelete,
  onClearSelection,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  gridColumns: GridColumns;
  onGridColumnsChange: (cols: GridColumns) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
  showArchivedOnly: boolean;
  onArchivedToggle: () => void;
  selectedCount: number;
  onBulkDownload: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === 'grid' && (
        <Select
          value={String(gridColumns)}
          onValueChange={(val) =>
            onGridColumnsChange(Number(val) as GridColumns)
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button
        variant={showFavoritesOnly ? 'default' : 'outline'}
        size="sm"
        onClick={onFavoritesToggle}
      >
        <Star className="h-4 w-4" />
        Favorites
      </Button>

      <Button
        variant={showArchivedOnly ? 'default' : 'outline'}
        size="sm"
        onClick={onArchivedToggle}
      >
        <Archive className="h-4 w-4" />
        Archived
      </Button>

      <div className="flex-1" />

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {selectedCount} selected
          </span>
          <Button variant="outline" size="sm" onClick={onBulkDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkArchive}>
            <Archive className="h-4 w-4" />
            Archive
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="ghost" size="icon" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function CertificatesSelectAll({
  isAllSelected,
  onToggleAll,
  currentCount,
}: {
  isAllSelected: boolean;
  onToggleAll: () => void;
  currentCount: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={isAllSelected} onCheckedChange={onToggleAll} />
      <span className="text-muted-foreground text-sm">
        Select All on Page ({currentCount})
      </span>
    </div>
  );
}

// function CertificatesHeader({
//   searchQuery,
//   onSearchChange,
//   selectedTag,
//   onTagChange,
//   sortOption,
//   onSortChange,
//   allTags,
//   viewMode,
//   onViewModeChange,
//   gridColumns,
//   onGridColumnsChange,
//   showFavoritesOnly,
//   onFavoritesToggle,
//   showArchivedOnly,
//   onArchivedToggle,
//   selectedCount,
//   onBulkDownload,
//   onBulkArchive,
//   onBulkDelete,
//   onClearSelection,
//   isAllSelected,
//   onToggleAll,
//   currentCount,
// }: {
//   searchQuery: string;
//   onSearchChange: (value: string) => void;
//   selectedTag: string | null;
//   onTagChange: (value: string | null) => void;
//   sortOption: SortOption;
//   onSortChange: (value: SortOption) => void;
//   allTags: string[];
//   viewMode: ViewMode;
//   onViewModeChange: (mode: ViewMode) => void;
//   gridColumns: GridColumns;
//   onGridColumnsChange: (cols: GridColumns) => void;
//   showFavoritesOnly: boolean;
//   onFavoritesToggle: () => void;
//   showArchivedOnly: boolean;
//   onArchivedToggle: () => void;
//   selectedCount: number;
//   onBulkDownload: () => void;
//   onBulkArchive: () => void;
//   onBulkDelete: () => void;
//   onClearSelection: () => void;
//   isAllSelected: boolean;
//   onToggleAll: () => void;
//   currentCount: number;
// }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <CertificatesSearchBar
//         searchQuery={searchQuery}
//         onSearchChange={onSearchChange}
//         selectedTag={selectedTag}
//         onTagChange={onTagChange}
//         sortOption={sortOption}
//         onSortChange={onSortChange}
//         allTags={allTags}
//       />
//       <CertificatesViewControls
//         viewMode={viewMode}
//         onViewModeChange={onViewModeChange}
//         gridColumns={gridColumns}
//         onGridColumnsChange={onGridColumnsChange}
//         showFavoritesOnly={showFavoritesOnly}
//         onFavoritesToggle={onFavoritesToggle}
//         showArchivedOnly={showArchivedOnly}
//         onArchivedToggle={onArchivedToggle}
//         selectedCount={selectedCount}
//         onBulkDownload={onBulkDownload}
//         onBulkArchive={onBulkArchive}
//         onBulkDelete={onBulkDelete}
//         onClearSelection={onClearSelection}
//       />
//       {currentCount > 0 && (
//         <CertificatesSelectAll
//           isAllSelected={isAllSelected}
//           onToggleAll={onToggleAll}
//           currentCount={currentCount}
//         />
//       )}
//     </div>
//   );
// }

function CertificatesHeader() {
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    gridColumns,
    setGridColumns,
    showFavoritesOnly,
    toggleFavoritesOnly,
    showArchivedOnly,
    toggleArchivedOnly,
  } = useCertificatesStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debouncedSearch] = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  // Placeholder
  const allTags = [
    'React',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'SQL',
    'Frontend',
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search certificates..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedTag || 'all'}
            onValueChange={(val) => setSelectedTag(val === 'all' ? null : val)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortOption}
            onValueChange={(val) => setSortOption(val as SortOption)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-md border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-7 px-3"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-7 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        {viewMode === 'grid' && (
          <Select
            value={String(gridColumns)}
            onValueChange={(val) => setGridColumns(Number(val) as GridColumns)}
          >
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          variant={showFavoritesOnly ? 'secondary' : 'outline'}
          size="sm"
          onClick={toggleFavoritesOnly}
        >
          <Star className="h-4 w-4" />
          Favorites
        </Button>
        <Button
          variant={showArchivedOnly ? 'secondary' : 'outline'}
          size="sm"
          onClick={toggleArchivedOnly}
        >
          <Archive className="h-4 w-4" />
          {showArchivedOnly ? 'Exit Archive' : 'Archived'}
        </Button>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toast.info('Exporting as CSV...')}>
              <FileSpreadsheet className="h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info('Exporting as PDF...')}>
              <FileText className="h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function CertificatesPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-muted-foreground hidden flex-1 text-sm sm:inline">
        Showing {startItem}-{endItem} of {totalItems} certificate(s)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[6, 12, 24, 48].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function CertificateDetailsDialog({
  certificate,
  open,
  onOpenChange,
  onDownload,
  onShare,
  onVerify,
}: {
  certificate: Certificate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {certificate.title}
          </DialogTitle>
          <DialogDescription>
            Certificate Details & Verification
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={certificate.imageUrl!}
              alt={certificate.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-2">
              <FileText className="text-muted-foreground mt-1 h-4 w-4" />
              <div>
                <p className="font-semibold">Issuer</p>
                <p className="text-muted-foreground text-sm">
                  {certificate.issuer}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="text-muted-foreground mt-1 h-4 w-4" />
              <div>
                <p className="font-semibold">Issue Date</p>
                <p className="text-muted-foreground text-sm">
                  {certificate.issueDate}
                </p>
              </div>
            </div>

            {certificate.expiryDate && (
              <div className="flex items-start gap-2">
                <AlertCircle className="text-muted-foreground mt-1 h-4 w-4" />
                <div>
                  <p className="font-semibold">Expiry Date</p>
                  <p className="text-muted-foreground text-sm">
                    {certificate.expiryDate}
                    {isExpired(certificate.expiryDate) && (
                      <Badge variant="destructive" className="ml-2">
                        Expired
                      </Badge>
                    )}
                    {isExpiringSoon(certificate.expiryDate) && (
                      <Badge variant="outline" className="ml-2">
                        Expiring Soon
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 font-semibold">Skills & Topics</p>
              <div className="flex flex-wrap gap-2">
                {certificate.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 font-semibold">Credential ID</p>
              <code className="bg-muted rounded px-2 py-1 text-sm">
                {certificate.credentialId}
              </code>
            </div>

            <div>
              <p className="mb-1 font-semibold">Description</p>
              <p className="text-muted-foreground text-sm">
                {certificate.description}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row items-end justify-end gap-2">
          <Button onClick={() => onDownload(certificate)} className="">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={() => onShare(certificate)}
            variant="secondary"
            className=""
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={() => onVerify(certificate)}
            variant="outline"
            className=""
          >
            <ExternalLink className="h-4 w-4" />
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShareDialog({
  certificate,
  open,
  onOpenChange,
}: {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `https://certificates.app/verify/${certificate?.credentialId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Certificate</DialogTitle>
          <DialogDescription>
            Share your certificate with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`https://certificates.app/verify/${certificate.credentialId}`}
              className="flex-1"
            />
            <Button onClick={handleCopyLink} size="icon" variant="outline">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" className="w-full">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button variant="outline" className="w-full">
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" className="w-full">
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{title}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditNotesDialog({
  certificate,
  open,
  onOpenChange,
  onSave,
}: {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(certificate?.notes || '');

  const handleSave = () => {
    onSave(notes);
    onOpenChange(false);
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          <DialogDescription>
            Add notes or description for {certificate.title}
          </DialogDescription>
        </DialogHeader>
        <div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] w-full resize-none rounded-md border p-3"
            placeholder="Add your notes here..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4" />
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CertificateCard({
  certificate,
  isSelected,
  onSelect,
  onCardClick,
  onToggleFavorite,
  onDownload,
  onShare,
  onVerify,
  onArchive,
  onDelete,
  onEditNotes,
  viewMode,
}: {
  certificate: Certificate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onCardClick: (cert: Certificate) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEditNotes: (cert: Certificate) => void;
  viewMode: ViewMode;
}) {
  const expired = isExpired(certificate.expiryDate);
  const expiringSoon = isExpiringSoon(certificate.expiryDate);

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden">
        <CardContent className="flex gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(certificate.id)}
            className="mt-1"
          />
          <div
            className="h-28 w-48 flex-shrink-0 cursor-pointer overflow-hidden rounded-md"
            onClick={() => onCardClick(certificate)}
          >
            <img
              src={certificate.imageUrl!}
              alt={certificate.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{certificate.title}</h3>
                <p className="text-muted-foreground text-xs">
                  {certificate.issuer} • {certificate.issueDate}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(certificate.id);
                  }}
                >
                  <Star
                    className={`h-4 w-4 ${
                      certificate.isFavorite
                        ? 'fill-yellow-400 text-yellow-400'
                        : ''
                    }`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditNotes(certificate)}>
                      <Edit className="h-4 w-4" />
                      Edit Notes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive(certificate.id)}>
                      <Archive className="h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(certificate.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              {certificate.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {certificate.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{certificate.tags.length - 3}
                </Badge>
              )}
            </div>
            {(expired || expiringSoon) && (
              <Alert
                variant={expired ? 'destructive' : 'default'}
                className="mb-2 py-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {expired ? 'Expired' : 'Expiring soon'} on{' '}
                  {certificate.expiryDate}
                </AlertDescription>
              </Alert>
            )}
            <div className="mt-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDownload(certificate)}
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(certificate)}
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerify(certificate)}
              >
                <ExternalLink className="h-3 w-3" />
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden pt-0">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(certificate.id)}
          className={cn(
            'transition-opacity',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        />
      </div>
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(certificate.id);
          }}
        >
          <Star
            className={`h-4 w-4 ${
              certificate.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
            }`}
          />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-muted/20 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditNotes(certificate)}>
              <Edit className="h-4 w-4" />
              Edit Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(certificate.id)}>
              <Archive className="h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(certificate.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden"
        onClick={() => onCardClick(certificate)}
      >
        <img
          src={decodeURIComponent(certificate.imageUrl!)}
          alt={certificate.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-8 w-8 text-white" />
        </div>
      </div>
      <CardContent className="flex-1 space-y-2">
        <div>
          <h3 className="font-semibold">{certificate.title}</h3>
          <p className="text-muted-foreground text-xs">
            Issued by {certificate.issuer} • {certificate.issueDate}
          </p>
        </div>
        {(expired || expiringSoon) && (
          <Alert variant={expired ? 'destructive' : 'default'} className="py-1">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {expired ? 'Expired' : 'Expiring soon'}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-wrap gap-2">
          {certificate.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          Credential ID: {certificate.credentialId}
        </p>
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(certificate);
          }}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare(certificate);
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onVerify(certificate);
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function CertificatesGrid({
  certificates,
  selectedIds,
  onSelect,
  onCardClick,
  onToggleFavorite,
  onDownload,
  onShare,
  onVerify,
  onArchive,
  onDelete,
  onEditNotes,
  viewMode,
  gridColumns,
}: {
  certificates: Certificate[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onCardClick: (cert: Certificate) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEditNotes: (cert: Certificate) => void;
  viewMode: ViewMode;
  gridColumns: GridColumns;
}) {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[gridColumns];

  return (
    <div
      className={`grid grid-cols-1 gap-2 ${
        viewMode === 'grid' ? gridColsClass : ''
      }`}
    >
      {certificates.map((cert) => (
        <CertificateCard
          key={cert.id}
          certificate={cert}
          isSelected={selectedIds.has(cert.id)}
          onSelect={onSelect}
          onCardClick={onCardClick}
          onToggleFavorite={onToggleFavorite}
          onDownload={onDownload}
          onShare={onShare}
          onVerify={onVerify}
          onArchive={onArchive}
          onDelete={onDelete}
          onEditNotes={onEditNotes}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

function CertificatesEmptyState() {
  return (
    <div className="py-12 text-center">
      <p className="text-muted-foreground">No certificates found</p>
    </div>
  );
}

export function CertificatesTab() {
  const { data, isLoading, isError, error, refetch } = useCertificates();

  const { viewMode, gridColumns } = useCertificatesStore();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailsDialog, setDetailsDialog] = useState<Certificate | null>(null);

  // const [certificates, setCertificates] = useState<Certificate[]>(() =>
  //   Array.from({ length: 12 }, (_, i) => createCertificate(i))
  // );
  // const [searchQuery, setSearchQuery] = useState('');
  // const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  // const [viewMode, setViewMode] = useState<ViewMode>('grid');
  // const [gridColumns, setGridColumns] = useState<GridColumns>(3);
  // const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // const [showArchivedOnly, setShowArchivedOnly] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(12);
  // const [detailsDialog, setDetailsDialog] = useState<Certificate | null>(null);
  // const [shareDialog, setShareDialog] = useState<Certificate | null>(null);
  // const [deleteDialog, setDeleteDialog] = useState<Certificate | null>(null);
  // const [editNotesDialog, setEditNotesDialog] = useState<Certificate | null>(
  //   null
  // );

  // const allTags = useMemo(() => {
  //   const tags = new Set<string>();
  //   certificates.forEach((cert) => cert.tags.forEach((tag) => tags.add(tag)));
  //   return Array.from(tags).sort();
  // }, [certificates]);

  // const filteredCertificates = useMemo(() => {
  //   let filtered = certificates.filter((cert) => {
  //     if (showArchivedOnly && !cert.isArchived) return false;
  //     if (!showArchivedOnly && cert.isArchived) return false;
  //     if (showFavoritesOnly && !cert.isFavorite) return false;

  //     const matchesSearch =
  //       cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase());

  //     const matchesTag = !selectedTag || cert.tags.includes(selectedTag);

  //     return matchesSearch && matchesTag;
  //   });

  //   filtered.sort((a, b) => {
  //     switch (sortOption) {
  //       case 'date-desc':
  //         return (
  //           new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  //         );
  //       case 'date-asc':
  //         return (
  //           new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
  //         );
  //       case 'title-asc':
  //         return a.title.localeCompare(b.title);
  //       case 'title-desc':
  //         return b.title.localeCompare(a.title);
  //       default:
  //         return 0;
  //     }
  //   });

  //   return filtered;
  // }, [
  //   certificates,
  //   searchQuery,
  //   selectedTag,
  //   sortOption,
  //   showFavoritesOnly,
  //   showArchivedOnly,
  // ]);

  // const paginatedCertificates = useMemo(() => {
  //   const startIndex = (currentPage - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   return filteredCertificates.slice(startIndex, endIndex);
  // }, [filteredCertificates, currentPage, pageSize]);

  const handleToggleFavorite = (id: string) => {
    toast.info(`Toggling favorite for ${id}`);
  };

  const handleDownload = (cert: Certificate) => {
    toast.info(`Downloading certificate: ${cert.title}`);
  };

  const handleShare = (cert: Certificate) => {
    toast.info('Saring');
  };

  const handleVerify = (cert: Certificate) => {
    window.open(cert.verificationUrl, '_blank');
  };

  const handleArchive = (id: string) => {
    toast.info(`Archiving ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Deleting ${id}`);
  };

  const handleSaveNotes = (notes: string) => {
    toast.info(`Saving notes`);
  };

  const handleSelectCertificate = (id: string) => {
    toast.info('Handle Select Certificate');
  };

  const handleSelectAll = () => {
    toast.info('Selected all');
  };

  const handleBulkDownload = () => {
    toast.info('Handle bulk Download');
  };

  const handleBulkArchive = () => {
    toast.info('Handle bulk Archive');
  };
  const setEditNotesDialog = () => {
    toast.info('Edit Note Dialog');
  };

  const handleBulkDelete = () => {
    toast.info('Handle bulk Delete');
  };

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-2">
      <CertificatesHeader />

      {isLoading ? (
        <CertificatesTabSkeleton viewMode={viewMode} />
      ) : data?.results && data.results.length > 0 ? (
        <>
          <CertificatesGrid
            certificates={data.results}
            selectedIds={selectedIds}
            onSelect={(id) => {
              setSelectedIds((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(id)) newSet.delete(id);
                else newSet.add(id);
                return newSet;
              });
            }}
            onCardClick={setDetailsDialog}
            onToggleFavorite={handleToggleFavorite}
            onDownload={handleDownload}
            onShare={handleShare}
            onVerify={handleVerify}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onEditNotes={setEditNotesDialog}
            viewMode={viewMode}
            gridColumns={gridColumns}
          />

          <CertificatesPagination
            currentPage={data.pagination.currentPage}
            pageSize={useCertificatesStore.getState().limit}
            totalItems={data.pagination.totalResults}
            onPageChange={useCertificatesStore.getState().setPage}
            onPageSizeChange={useCertificatesStore.getState().setLimit}
          />
        </>
      ) : (
        <CertificatesEmptyState />
      )}

      {detailsDialog && (
        <CertificateDetailsDialog
          certificate={detailsDialog}
          open={!!detailsDialog}
          onOpenChange={(open) => !open && setDetailsDialog(null)}
          onDownload={handleDownload}
          onShare={handleShare}
          onVerify={handleVerify}
        />
      )}

      {/* <ShareDialog
        certificate={shareDialog}
        open={!!shareDialog}
        onOpenChange={(open) => !open && setShareDialog(null)}
      />

      <DeleteConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog.id)}
        title={deleteDialog?.title || ''}
      />

      <EditNotesDialog
        certificate={editNotesDialog}
        open={!!editNotesDialog}
        onOpenChange={(open) => !open && setEditNotesDialog(null)}
        onSave={handleSaveNotes}
      /> */}
    </div>
  );
}

export function CertificatesTabSkeleton({
  viewMode = 'grid',
}: {
  viewMode?: ViewMode;
}) {
  return (
    <div className="space-y-4">
      <CertificatesHeaderSkeleton />
      <CertificatesGridSkeleton viewMode={viewMode} />
      <CertificatesPaginationSkeleton />
    </div>
  );
}

function CertificatesGridSkeleton({
  viewMode = 'grid',
}: {
  viewMode?: ViewMode;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''
      }`}
    >
      <CertificateCardSkeleton viewMode={viewMode} />
      <CertificateCardSkeleton viewMode={viewMode} />
      <CertificateCardSkeleton viewMode={viewMode} />
    </div>
  );
}

function CertificatesHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <CertificatesSearchBarSkeleton />
      <CertificatesViewControlsSkeleton />
    </div>
  );
}

function CertificatesViewControlsSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-9 w-[120px]" />
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function CertificatesSearchBarSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-full sm:w-[180px]" />
      <Skeleton className="h-10 w-full sm:w-[180px]" />
    </div>
  );
}

function CertificatesPaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Skeleton className="h-5 w-48" />
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

function CertificateCardSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex gap-4 p-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-28 w-48 rounded-md" />
          <div className="flex-1 space-y-3">
            <div>
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="flex-1 space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
}
