<?php

namespace  App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;


     public function __construct(UserPasswordEncoderInterface $encoder)
     {
         $this->encoder=$encoder;
     }

    public static function getSubscribedEvents()
    {
        return  [
             KernelEvents::VIEW=>['encodePassword',EventPriorities::PRE_WRITE]
        ];
    }

    public function encodePassword(ViewEvent $event)// $event : on juste au momemt en l'ecriture sur la base
    {
        $user = $event->getControllerResult();
       
        $method=$event->getRequest()->getMethod();// GET POST PUT .....

        if($user instanceof User && $method=="POST"){
            $hash=$this->encoder->encodePassword($user,$user->getPassword());
            $user->setPassword($hash);
           // dd($user);
        }
    }
}