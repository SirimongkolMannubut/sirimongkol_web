from django.shortcuts import render, HttpResponse

# Create your views here.
def indexPage(request):
    return render(request, 'index.html')

def aboutUs(request):
    return render(request, 'about.html')


def contactUs(request):
    return render(request, 'contact.html')

def forPage(request):
    context = {}
    lt = list(range(0, 100))
    context["list"] = lt

    return render(request, 'for_test.html', context)


def cardPage(request):
    return render(request, 'card_template.html', {'range': range(100)})

#def cradcolorUs(request):
   # return render(request, 'crad_colorr.html')




def cradcolorUs(request):
    if request.method == "GET":
        color = request.GET.get('color')
        print(color)
    return render(request, 'crad_colorr.html')


def forpageUs (request):
    email =''
    password = ''
    
    context = {}
    
    if request.method =="POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
    
    context ['email'] = email
    context ['password'] = password
        
    return render (request, 'for_page.html', context) 

def games1Us(request):
    return render(request, 'game1.html')

