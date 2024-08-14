from django.urls import path
from . import views

urlpatterns =[
    path("", views.indexPage, name="index") ,
    path("about/", views.aboutUs, name="about"),
    path("contact/", views.contactUs, name="contact"),
    path('for_test/', views.forPage, name="for_test"),
    path("card_template/", views.cardPage, name="card_template" ),
    path("card_colorr/", views.cradcolorUs, name="crad_colorr" ),
    path("for_page/", views.forpageUs, name="for_page" )
    
]